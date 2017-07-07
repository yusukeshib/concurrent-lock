import 'regenerator-runtime/runtime'
import should from 'should'
import assert from 'assert'
import Lock from '../src'
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
    await lock.lock(100)
  } catch(err) {
    should(err).be.instanceOf(Error)
    should(err).have.property('message')
    should(err.message).be.exactly('Timeout')
  }
})

it('locking should not be passed twice if concurrent limit===1.', async () => {
  const lock = new Lock(1)
  const locked1 = await lock.tryLock()
  should(locked1).be.exactly(true)
  const locked2 = await lock.tryLock()
  should(locked2).be.exactly(false)
})

it('locking should be passed twice if concurrent limit===2.', async () => {
  const lock = new Lock(2)
  const locked1 = await lock.tryLock()
  should(locked1).be.exactly(true)
  const locked2 = await lock.tryLock()
  should(locked2).be.exactly(true)
})

it('tryLock should timeout if already locked.', async () => {
  const lock = new Lock()
  await lock.lock()
  const locked = await lock.tryLock(200)
  should(locked).be.exactly(false)
})

