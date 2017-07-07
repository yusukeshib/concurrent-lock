import EventEmitter from 'event-emitter'

export default class Lock {
  constructor(limit) {
    this._limit = limit || 1
    this._lock = false
    this._ee = new EventEmitter()
  }
  _waitUnlock(timeout) {
    return new Promise(resolve => {
      setTimeout(() => this._ee.emit('unlock', new Error('timeout')), timeout)
      this._ee.once('unlock', err => err ? reject(err) : resolve())
    })
  }
  isLocked() {
    return this._lock
  }
  async tryLock(timeout) {
    try {
      await this.lock(timeout)
      return true
    } catch(err) {
      return false
    }
  }
  async lock(timeout) {
    if(this._lock) await this._waitUnlock(timeout)
    this._lock = true
    this._ee.emit('lock')
  }
  unlock() {
    if(!this._lock) throw 'Already unlocked!'
    this._lock = false
    this._ee.emit('unlock')
  }
}
