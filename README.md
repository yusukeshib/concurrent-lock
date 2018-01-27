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
  await lock.lock()
  await someAsyncProcess()
  lock.unlock()
}
```

Lock and unlock with timeout(3000 millisec).
If failed aquiring lock, throw timeout error.
```js
async somefunc() {
  try {
    await lock.lock(3000)
    // ...some async proc...
    lock.unlock()
  } catch(err) {
    // Timeout error will be catched.
  }
}
```

## Author

Yusuke Shibata

## Licence

MIT
