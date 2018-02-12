// only firable once
class Signal {
  fire(err) {
    const fn = this._fn
    delete this._fn
    if(fn) fn(err)
  }
  wait(timeout) {
    return new Promise((resolve, reject) => {
      this._fn = err => err ? reject(err) : resolve()
      if(timeout !== undefined) setTimeout(() => this.fire(new Error('Timeout')), timeout)
    })
  }
}

export default class Lock {
  constructor(limit = 1) {
    this._limit = limit
    this._locked = 0
    this._waiters = []
  }
  isLocked() {
    return this._locked >= this._limit
  }
  async lock(timeout) {
    if(this.isLocked()) {
      const signal = new Signal()
      this._waiters.push(signal)
      await signal.wait(timeout)
    }
    this._locked++
  }
  unlock() {
    if(this._locked <= 0) throw new Error('Already unlocked')
    this._locked--
    const signal = this._waiters.shift()
    if(signal) {
      signal.fire()
    }
  }
}
