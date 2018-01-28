# concurrent-lock

Promise based lock object supporting simultaneous access limit.

## Install

```sh
npm install concurrent-lock
```

## Usage

Create lock object with concurrent limit.
```js
import Lock from 'concurrent-lock'

// concurrent access limit = 1
const simultaneous_limit = 2
const lock = new Lock(simultaneous_limit)

async somefunc() {
  await lock.lock()
  // ...some async proc...
  lock.unlock()

  // you can set timeout argument as millisec
  // Timeout error will be thrown if lock couldn't acquire within specified timeout millisec.
  await lock.lock(3000)
  // ...some async proc...
  lock.unlock()
}
```

## Author

Yusuke Shibata

## Licence

MIT
