import { Meteor } from 'meteor/meteor'
import assert from 'assert'

describe('continente-watcher', function () {
  it('package.json has correct name', async function () {
    const { name } = await import('../package.json')
    assert.strictEqual(name, 'continente-watcher')
  })

  if (Meteor.isClient) {
    it('client is not server', function () {
      assert.strictEqual(Meteor.isServer, false)
    })
  }

  if (Meteor.isServer) {
    it('server is not client', function () {
      assert.strictEqual(Meteor.isClient, false)
    })
  }
})