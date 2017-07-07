# Concurrent promise based lock

## Usage

```js
import Lock from 'concurrent-lock'

// concurrent access limit = 1
const lock = new Lock(1)

async somefunc() {
  await lock.lock()
  // ...some async proc...
  lock.unlock()
}

async somefunc() {
  // specify timeout millisec.
  const locked = await lock.tryLock(2000)
  if(!locked) return
  // ...some async proc...
  lock.unlock()
}
```

## Implementations

### constructor
### lock
### unlock
### tryLock
### isLocked

## Author

Yusuke Shibata

## Licence

MIT
