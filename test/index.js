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

