# Worker Topology

Node.js Worker Threads are great. It is, however, a bit tricky to develop cleanly separated worker codes and build a sophisticated worker topology.  This library is developed to get rid of such difficulties and let you to focus on implementing the main functionality.

Think of that you just
* List workers with optional settings
* Name worker channels as pairs
* Call topology composer

Then, Voila!  You will have
* all workers are up and running
* pointers to worker instances in tha main thread
* port objects in workers and main thread as you declared

## Installation

```shell
npm install workertopology
```

## How to Use

In both main and worker threads you just need to require 'workertopology',  If you need additional worker threads functionality, you would require 'worker_threads' as well.

In the main thread, you will get a topology composer function.  Let us build a very primitive topology which consists of a main and a worker thread.

```javascript
const topologydef = {
    "workers": {
        "test": {path: "./spec/simple-worker.js", options: {stdout: false}}
    },
    "channels": [
        ["main", "test"]
    ]
}

const worker_topolopy = require('workertopolopy');

let topology = worker_topolopy(topologydef);
topology.ports.test.postMessage('Hello worker');
topology.ports.test.on('message', (msg) => {
    console.log('Reply from worker: ', msg);
});
```

The sample above tells itself intuitively.  The topology definition object has `'workers'` and `'channels'` parts.  Composer returns an object with `'workers'` and `'ports'` objects.  We only referred to `'ports'` object above to listen and post messages to the port named `'test'`.

```javascript
const {ports} = require('../index.js');

ports.main.on('message', (msg) => {
    console.log('Main thread says:', msg);
    ports.main.postMessage('Hello main thread');
});
```

The worker side is simpler than the main,  The `'ports'` object has the attached ports as declared in the topology definition.

## A More Sophisticated Example

## API

### Main Thread

### Worker Threads


## Internals

## See Also
