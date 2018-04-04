const tap = require('tap')
const Plugin = require('../lib')

const test = tap.test

test('do nothing if non aws cn region', t => {
    let plugin = new Plugin({
        service: {
            provider: {}
        }
    }, {})

    t.is(plugin.hooks, undefined)
    t.end()
})

test('create plugin if in aws cn region', t => {
    let plugin = new Plugin({
        service: {
            provider: {
                name: 'aws'
            }
        }
    }, { region: 'cn-north-1' })

    t.ok(plugin.hooks)
    t.end()
})
