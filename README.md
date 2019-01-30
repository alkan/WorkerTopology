# Worker Topology

Node.js Worker Threads are great. It is, however, a bit tricky to develop cleanly separated worker codes and build a sophisticated worker topology.  This library is developed to get rid of such difficulties.

Think of that you just
* List workers with optional settings
* Specify worker channels as pairs
* Call topology compozer
Then, Voila!  You will have
* all workers are up and running
* pointers to worker instances in tha main thread
* port objects are attached to workers and the main thread as you declared


## Installation

'''shell
npm install workertopology
'''

## How to Use

Either in main or worker sources you will require `'workertopology'` module.  If you need additional worker threads functionality, you would require `'worker_threads'` module, too.

## API

### Moin Thread

### Worker Threads


## Internals
