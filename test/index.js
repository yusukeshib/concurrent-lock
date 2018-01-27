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

it('Unlocking already unlocked object should throw error.', async () => {
  const lock = new Lock()
  try {
    lock.unlock()
  } catch(err) {
    should(err).be.instanceOf(Error)
    should(err).have.property('message')
    should(err.message).be.exactly('Already unlocked')
  }
})

it('Lock object should be timeout after specified timeout elapsed.', async () => {
  const lock = new Lock()
  await lock.lock()
  try {
    await lock.lock(50)
  } catch(err) {
    should(err).be.instanceOf(Error)
    should(err).have.property('message')
    should(err.message).be.exactly('Timeout')
  }
})

it('locking should not be passed twice if concurrent limit===1.', async () => {
  const lock = new Lock(1)
  await lock.lock(0)
  try {
    await lock.lock(0)
  } catch(err) {
    should(err).be.instanceOf(Error)
    should(err).have.property('message')
    should(err.message).be.exactly('Timeout')
  }
})

it('locking should be passed twice if concurrent limit===2.', async () => {
  const lock = new Lock(2)
  await lock.lock()
  should(lock.isLocked()).be.exactly(false)
  await lock.lock()
  should(lock.isLocked()).be.exactly(true)
  try {
    await lock.lock(0)
  } catch(err) {
    should(err).be.instanceOf(Error)
    should(err).have.property('message')
    should(err.message).be.exactly('Timeout')
  }
})

it('tryLock should timeout if already locked.', async () => {
  const lock = new Lock()
  await lock.lock()
  try {
    await lock.lock(50)
  } catch(err) {
    should(err).be.instanceOf(Error)
    should(err).have.property('message')
    should(err.message).be.exactly('Timeout')
  }
})

