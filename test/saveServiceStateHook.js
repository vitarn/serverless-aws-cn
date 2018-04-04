const tap = require('tap')
const Plugin = require('../lib')
const template = require('./template.json')

const test = tap.test

test('before:aws:package:finalize:saveServiceState', t => {
    let serverless = {
        service: {
            provider: {
                name: 'aws',
                compiledCloudFormationTemplate: template
            }
        },
        cli: {
            log: () => { }
        }
    }
    let options = { region: 'cn-north-1' }
    let plugin = new Plugin(serverless, options)
    let hook = plugin.hooks['before:aws:package:finalize:saveServiceState']

    hook()

    t.is(template.Resources.TestLambdaPermissionApiGateway.Properties.Principal['Fn::Join'][1][1], 'amazonaws.com')
    t.end()
})
