// only firable once
class Signal {
  constructor(fn) {
    this._fn = fn
    this._fired = false
  }
  fire() {
    if(this._fired) return
    this._fired = true
    this._fn.apply(this, arguments)
  }
}

export default class Lock {
  constructor(limit) {
    this._limit = limit || 1
    this._lock = 0
    this._queue = []
  }
  _wait(timeout) {
    return new Promise((resolve, reject) => {
      const signal = new Signal(err => err ? reject(err) : resolve())
      this._queue.push(signal)
      if(timeout !== undefined) setTimeout(() => signal.fire(new Error('Timeout')), timeout)
    })
  }
  isLocked() {
    return this._lock >= this._limit
  }
  async tryLock(timeout) {
    try {
      await this.lock(timeout || 0)
      return true
    } catch(err) {
      return false
    }
  }
  async lock(timeout) {
    if(this.isLocked()) await this._wait(timeout)
    this._lock++
  }
  unlock() {
    if(this._lock <= 0) throw new Error('Already unlocked')
    this._lock--
    const signal = this._queue.shift()
    if(signal) {
      signal.fire()
    }
  }
}
