# concurrent-lock

Promise based lock object supporting semaphore like sharing count.

## Install

```sh
npm install concurrent-lock
```

## Usage

Create lock object with concurrent limit.
```js
import Lock from 'concurrent-lock'

// concurrent access limit = 1
const lock = new Lock(1)
```

Lock and unlock.
```js
async somefunc() {
  try {
    await lock.lock()
    // ...some async proc...
  } catch(err) {
    lock.unlock()
  }
}
```

Lock and unlock with timeout(3000 millisec).
If failed aquiring lock, throw timeout error.
```js
async somefunc() {
  try {
    await lock.lock(3000)
    // ...some async proc...
  } catch(err) {
    lock.unlock()
  }
}
```

`tryLock` will return true|false, and never throw timeout errors.
```js
async somefunc() {
  // specify timeout millisec.
  if(await lock.tryLock(2000)) {
    // ...some async proc...
    lock.unlock()
  }
}
```

## Author

Yusuke Shibata

## Licence

MIT
