# Taming Node Worker Threads

Worker Threads is a Node.js implementation of HTML5@s Web Workers specification -- with a few context specific updatesz  Altought it would be comparable to sub-processes, worker threads is lighter, more flexible and easier to manage and compose.

A multi--threaded Node application consists of a main and one or more worker processes, and and a number of channels to pair processes.  Any kind of memory sharing is not allowed to threads.Instead, messaging channels supply a well organized, event based communication platform among worker/main threads.

Let us start with a primitive example from [Node Documentation](https://nodejs.org/dist/latest-v12.x/docs/api/worker_threads.html) pages:

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Prints 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // When a message from the parent thread is received, send it back:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```

The above example denotes the idea, however that approach is a bit confusing and not suitable to extend.  If we start a real world implementation with this approach, we will be faced several problems as follows:

* we prefer to write main and worker codes into separate files
* we would not like to place whole code inside an `if` block
* what if wo need more than one worker
* how to organize worker-to-worker messaging

Fes, actually while we were designing a sophisticated multi-thread Node application, we tried to e.v.lop a clean, flexible, composable approach.  Then we realized that it would be a reusable framework, and we shared at  [Worker Topology](https://github.com/alkan/WorkerTopology) project.
