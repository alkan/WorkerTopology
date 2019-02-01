# Worker Topology &nbsp;&nbsp;&nbsp; ![Travis](https://travis-ci.org/alkan/WorkerTopology.svg?branch=master)

Node.js Worker Threads are great. It is, however, a bit tricky to develop cleanly separated worker codes and build a sophisticated worker topology.  This library is developed to get rid of such difficulties.

Think of that you just
* List workers with optional settings
* Specify worker channels as pairs
* Call topology compozer

Then, Voila!  You will have
* all workers are up and running
* pointers to worker instances in the main thread
* port objects are attached to workers and the main thread as you declared

## Installation

```shell
npm install workertopology
```

## How to Use

In both main and worker sources, you will just require `'workertopology'` module.  If you need additional worker threads functionality, you would require `'worker_threads'` module, too.  

You start with definition of the topology in tho main thread.  Probably the most primitive topology would consists of a main and a worker pair.  Every worker topology definition should contain `'workers'` object and a list of `'channels'`.

```javascript
const topologydef = {
    "workers": {
        "test": {path: "./spec/simple-worker.js", options: {stdout: false}}
    },
    "channels": [
        ["main", "test"]
    ]
}
```

The next easy step is to create the working topology by calling the composer.

```javascript
const worker_topolopy = require('workertopology');
let topology = worker_topolopy(topologydef);
topology.ports.test.postMessage('Hello worker');
topology.ports.test.on('message', (msg) => {
    console.log('Reply from worker: ', msg);
});
```
That is all.  You can attach your event handlers and start communication through ports of channels.  And what about workers?  As seen below, it is dead simple.

```javascript
const {ports} = require('WorkerTopology');

ports.main.on('message', (msg) => {
    console.log('Main thread says:', msg);
    ports.main.postMessage('Hello main thread');
});
```
This simple sample depicts all API components of the library, indeed.  I hope it is understandable intuitively.  Proceed the API section for more details.

## A More Sophisticated Sample



![Accumulator topology](spec/acc.png)


## API

Depending on the role of requiring source file (main rr worker), you will get different functionality as described below.

### Ma```javascript
 Threadconst topologydef = {
     "workers": {
         "test": {path: "./spec/simple-worker.js", options: {stdout: false}}
     },
     "channels": [
         ["main", "test"]
     ]
 }
```

```javascript
const worker_topolopy = require('workertopology');
let topology = worker_topolopy(topologydef);
topology.ports.test.postMessage('Hello worker');
topology.ports.test.on('message', (msg) => {
    console.log('Reply from worker: ', msg);
    //topology.workers.test.terminate();
    done();
});
```

### Worker Threads


## Internals

api differences

proxy

testing
