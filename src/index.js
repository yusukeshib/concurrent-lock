class Signal {
  static instances = []
  static async wait(timeout) {
    const signal = new Signal()
    this.instances.push(signal)
    await signal._wait(timeout)
  }
  static fire() {
    const signal = this.instances.shift()
    if(signal) signal._fire()
  }
  _fire(err) {
    const fn = this._fn
    delete this._fn
    if(fn) fn(err)
  }
  _wait(timeout) {
    return new Promise((resolve, reject) => {
      this._fn = err => err ? reject(err) : resolve()
      if(timeout !== undefined) setTimeout(() => this._fire(new Error('Timeout')), timeout)
    })
  }
}

export default class Lock {
  constructor(limit = 1) {
    this._limit = limit
    this._locked = 0
  }
  isLocked() {
    return this._locked >= this._limit
  }
  async lock(timeout) {
    if(this.isLocked()) {
      await Signal.wait(timeout)
    }
    this._locked++
  }
  unlock() {
    if(this._locked <= 0) {
      throw new Error('Already unlocked')
    }
    this._locked--
    Signal.fire()
  }
}
