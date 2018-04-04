'use strict'

const chalk = require('chalk')

/**
 * Validate and tune AWS CN region config
 * 
 * * Assert provider.endpointType is regional
 * * Prevent provider.environment
 * * Prevent function.environment
 * * Prevent function.awsKmsKeyArn
 * * Replace YourFuncLambdaPermissionApiGateway.Properties.Principal with `apigateway.amazonaws.com`
 * 
 * @see https://github.com/serverless/serverless/pull/4665#issuecomment-365843810
 */
module.exports = function serverlessAWSCN(serverless, options) {
    const service = serverless.service
    const provider = service.provider
    const name = provider.name
    const region = options.region || provider.region || ''

    const isAWSCN = name === 'aws' && region.substr(0, 3) === 'cn-'

    if (!isAWSCN) return

    const warn = (function (message) {
        this.cli.consoleLog('Serverless: ' + chalk.redBright('FAILURE: ' + message))
        return message
    }).bind(serverless)

    function fail(message) {
        warn(message)
        throw new Error(message)
    }

    this.hooks = {
        'before:package:compileFunctions': function () {
            if (provider.endpointType && provider.endpointType.toLowerCase() !== 'regional') {
                fail(`AWS CN provider endpointType must be 'regional'!
                    provider.endpointType: ${provider.endpointType}`)
            }

            if (provider.environment) {
                fail(`AWS CN provider environment is not supported!
                    provider.environment: ${provider.environment}`)
            }

            service.getAllFunctions().forEach(function (functionName) {
                const functionObject = service.getFunction(functionName)

                if (functionObject.environment) {
                    fail(`AWS CN lambda function environment is not supported!
                        functions.${functionName}.environment: ${functionObject.environment}`)
                }

                if (functionObject.awsKmsKeyArn) {
                    fail(`AWS CN KMS service is not supported!
                        functions.${functionName}.awsKmsKeyArn: ${functionObject.awsKmsKeyArn}`)
                }
            })
        },

        'before:aws:package:finalize:saveServiceState': function () {
            const template = provider.compiledCloudFormationTemplate

            Object.keys(template.Resources)
                .forEach(key => {
                    const res = template.Resources[key]

                    if (res.Type === 'AWS::Lambda::Permission') {
                        serverless.cli.log(`Replace ${key} Principal 'AWS::URLSuffix' to 'amazonaws.com'`)
                        res.Properties.Principal['Fn::Join'][1][1] = 'amazonaws.com'
                    }
                })
        },
    }
}
