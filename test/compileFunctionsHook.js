const tap = require('tap')
const Plugin = require('../lib')
const template = require('./template.json')

const test = tap.test

test('before:package:compileFunctions', t => {
    let serverless = {
        service: {
            provider: {
                name: 'aws'
            },
            getAllFunctions() {
                return ['test']
            },
            getFunction(name) {
                return {}
            }
        },
        cli: {
            consoleLog: () => { }
        }
    }
    let options = { region: 'cn-north-1' }
    let plugin = new Plugin(serverless, options)
    let hook = plugin.hooks['before:package:compileFunctions']

    t.notThrow(hook)
    t.end()
})

test('provider endpointType', t => {
    let serverless = {
        service: {
            provider: {
                name: 'aws',
                endpointType: 'edge'
            }
        },
        cli: {
            consoleLog: () => { }
        }
    }
    let options = { region: 'cn-north-1' }
    let plugin = new Plugin(serverless, options)
    let hook = plugin.hooks['before:package:compileFunctions']

    t.throws(hook, `provider endpointType must be 'regional'`)
    t.end()
})

test('provider environment', t => {
    let serverless = {
        service: {
            provider: {
                name: 'aws',
                environment: {}
            }
        },
        cli: {
            consoleLog: () => { }
        }
    }
    let options = { region: 'cn-north-1' }
    let plugin = new Plugin(serverless, options)
    let hook = plugin.hooks['before:package:compileFunctions']

    t.throws(hook, 'provider environment is not supported')
    t.end()
})

test('function environment', t => {
    let serverless = {
        service: {
            provider: {
                name: 'aws'
            },
            getAllFunctions() {
                return ['test']
            },
            getFunction(name) {
                return {
                    environment: {}
                }
            }
        },
        cli: {
            consoleLog: () => { }
        }
    }
    let options = { region: 'cn-north-1' }
    let plugin = new Plugin(serverless, options)
    let hook = plugin.hooks['before:package:compileFunctions']

    t.throws(hook, 'function environment is not supported')
    t.end()
})

test('function environment', t => {
    let serverless = {
        service: {
            provider: {
                name: 'aws'
            },
            getAllFunctions() {
                return ['test']
            },
            getFunction(name) {
                return {
                    awsKmsKeyArn: 'arn:'
                }
            }
        },
        cli: {
            consoleLog: () => { }
        }
    }
    let options = { region: 'cn-north-1' }
    let plugin = new Plugin(serverless, options)
    let hook = plugin.hooks['before:package:compileFunctions']

    t.throws(hook, 'KMS service is not supported')
    t.end()
})
