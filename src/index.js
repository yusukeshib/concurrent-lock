import EventEmitter from 'event-emitter'

export default class Lock {
  constructor(limit) {
    this._limit = limit || 1
    this._lock = 0
    this._ee = new EventEmitter()
  }
  _waitUnlock(timeout) {
    return new Promise((resolve, reject) => {
      if(timeout !== undefined) setTimeout(() => this._ee.emit('unlock', new Error('Timeout')), timeout)
      this._ee.once('unlock', err => err ? reject(err) : resolve())
    })
  }
  isLocked() {
    return this._lock >= this._limit
  }
  async tryLock(timeout) {
    try {
      await this.lock(timeout||0)
      return true
    } catch(err) {
      return false
    }
  }
  async lock(timeout) {
    if(this.isLocked()) await this._waitUnlock(timeout)
    this._lock++
    this._ee.emit('lock')
  }
  unlock() {
    if(this._lock <= 0) throw new Error('Already unlocked')
    this._lock--
    this._ee.emit('unlock')
  }
}
