import 'babel-polyfill'
import should from 'should'
import assert from 'assert'
import Lock from '..'
import 'mocha'

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

it('Lock object should be locked between lock and unlock.', async () => {
  const lock = new Lock()
  await lock.lock()
  should(lock.isLocked()).be.exactly(true)
  lock.unlock()
})

it('Lock object should be unlocked after unlock.', async () => {
  const lock = new Lock()
  await lock.lock()
  lock.unlock()
  should(lock.isLocked()).be.exactly(false)
})

it('Lock object isn\'t locked when locks remain.', async () => {
  const lock = new Lock(3)
  await lock.lock()
  await lock.lock()
  should(lock.isLocked()).be.exactly(false)
})

it('Lock object imidiately timeout on timeout argument is 0', async () => {
  const lock = new Lock()
  await lock.lock()
  let err
  try {
    await lock.lock(0)
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Timeout')
})

it('Lock object would be locked when locks do not remain.', async () => {
  const lock = new Lock(2)
  await lock.lock()
  await lock.lock()
  let err
  try {
    await lock.lock(0)
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Timeout')
})

it('Unlocking already unlocked object should throw error.', async () => {
  const lock = new Lock()
  let err
  try {
    lock.unlock()
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Already unlocked')
})

it('Lock object should timeout after specified timeout elapsed.', async () => {
  const lock = new Lock()
  await lock.lock()
  let err
  try {
    await lock.lock(50)
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Timeout')
})

it('locking should not be passed twice if concurrent limit===1.', async () => {
  const lock = new Lock(1)
  await lock.lock(0)
  let err
  try {
    await lock.lock(0)
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Timeout')
})

it('locking should be passed twice if concurrent limit===2.', async () => {
  const lock = new Lock(2)
  await lock.lock()
  should(lock.isLocked()).be.exactly(false)
  await lock.lock()
  should(lock.isLocked()).be.exactly(true)
  let err
  try {
    await lock.lock(0)
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Timeout')
})

it('lock should timeout if already locked.', async () => {
  const lock = new Lock()
  await lock.lock()
  let err
  try {
    await lock.lock(50)
  } catch(_err) {
    err = _err
  }
  should(err).be.instanceOf(Error)
  should(err).have.property('message')
  should(err.message).be.exactly('Timeout')
})

