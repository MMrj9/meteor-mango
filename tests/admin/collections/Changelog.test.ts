import { expect } from 'chai'
import { logChanges, Changelog } from '/imports/api/changelog'
import sinon from 'sinon'
import { Meteor } from 'meteor/meteor'

describe('logChanges', () => {
  let insertStub: sinon.SinonStub
  let userIdStub: sinon.SinonStub
  let userStub: sinon.SinonStub

  beforeEach(() => {
    insertStub = sinon.stub(Changelog, 'insert')
    userIdStub = sinon.stub(Meteor, 'userId').returns('testUserId')
    userStub = sinon
      .stub(Meteor, 'user')
      .returns({ _id: 'id', username: 'testUser' })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should log changes when fields are updated', () => {
    const existingDoc = { name: 'John Doe', age: 30 }
    const updatedDoc = { name: 'John Smith', age: 30 }

    const changes = logChanges(
      'doc123',
      'Users',
      'update',
      existingDoc,
      updatedDoc,
    )

    expect(changes).to.deep.equal([
      { field: 'name', oldValue: 'John Doe', newValue: 'John Smith' },
    ])

    expect(insertStub.calledOnce).to.be.true

    const log = insertStub.getCall(0).args[0]
    expect(log).to.include({
      objectId: 'doc123',
      collection: 'Users',
      changeType: 'update',
    })
    expect(log.changes).to.deep.equal([
      { field: 'name', oldValue: 'John Doe', newValue: 'John Smith' },
    ])
    expect(log.user).to.equal('testUser')
  })

  it('should handle nested object changes correctly', () => {
    const existingDoc = { profile: { name: 'John', age: 30 } }
    const updatedDoc = { profile: { name: 'John Doe', age: 30 } }

    const changes = logChanges(
      'doc123',
      'Users',
      'update',
      existingDoc,
      updatedDoc,
    )

    expect(changes).to.deep.equal([
      { field: 'profile.name', oldValue: 'John', newValue: 'John Doe' },
    ])
    expect(insertStub.calledOnce).to.be.true
  })

  it('should handle array changes correctly', () => {
    const existingDoc = { tags: ['tag1', 'tag2'] }
    const updatedDoc = { tags: ['tag1', 'tag3'] }

    const changes = logChanges(
      'doc123',
      'Items',
      'update',
      existingDoc,
      updatedDoc,
    )

    expect(changes).to.deep.equal([
      { field: 'tags', oldValue: ['tag1', 'tag2'], newValue: ['tag1', 'tag3'] },
    ])
    expect(insertStub.calledOnce).to.be.true
  })

  it('should not log changes for unchanged fields', () => {
    const existingDoc = { name: 'John', age: 30 }
    const updatedDoc = { name: 'John', age: 30 }

    const changes = logChanges(
      'doc123',
      'Users',
      'update',
      existingDoc,
      updatedDoc,
    )

    expect(changes).to.deep.equal([])
    expect(insertStub.notCalled).to.be.true
  })

  it('should log new fields on document creation', () => {
    const updatedDoc = { name: 'John', age: 30 }

    const changes = logChanges(
      'doc123',
      'Users',
      'create',
      undefined,
      updatedDoc,
    )

    expect(changes).to.deep.equal([
      { field: 'name', oldValue: undefined, newValue: 'John' },
      { field: 'age', oldValue: undefined, newValue: 30 },
    ])
    expect(insertStub.calledOnce).to.be.true
  })

  it('should log removed fields on document deletion', () => {
    const existingDoc = { name: 'John', age: 30 }

    const changes = logChanges('doc123', 'Users', 'delete', existingDoc, {})

    expect(changes).to.deep.equal([
      { field: 'name', oldValue: 'John', newValue: undefined },
      { field: 'age', oldValue: 30, newValue: undefined },
    ])
    expect(insertStub.calledOnce).to.be.true
  })

  it('should ignore fields specified in ignore list', () => {
    const existingDoc = { name: 'John', createdAt: '2023-01-01' }
    const updatedDoc = { name: 'John Smith', createdAt: '2023-01-01' }

    const changes = logChanges(
      'doc123',
      'Users',
      'update',
      existingDoc,
      updatedDoc,
    )

    expect(changes).to.deep.equal([
      { field: 'name', oldValue: 'John', newValue: 'John Smith' },
    ])
    expect(insertStub.calledOnce).to.be.true
  })

  it('should log empty changes for invalid input', () => {
    const existingDoc = { name: 'John' }
    const updatedDoc = null as any

    const changes = logChanges(
      'doc123',
      'Users',
      'update',
      existingDoc,
      updatedDoc,
    )

    expect(changes).to.deep.equal([])
    expect(insertStub.notCalled).to.be.true
  })
})
