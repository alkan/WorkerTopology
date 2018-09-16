const assert = require('assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort, workerData
} = require('worker_threads');
if (isMainThread) {
  const subChannel = new MessageChannel();
  const worker = new Worker(__filename);
  worker.postMessage({ hereIsYourPort: subChannel.port1, name: 'p1' }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  let ports = {};

  const get_ports = () => new Promise((resolve, reject) => {
    parentPort.once('message', (value) => {
      assert(value.hereIsYourPort instanceof MessagePort);
      resolve(value);
    });
  });
  /*
  (async () => {
    console.log('------------------');
    let value = await get_ports();
    console.log(value.name);
    ports[value.name] = value.hereIsYourPort;
    ports.p1.postMessage('the worker is sending this');
    //value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
    ports[value.name] = value.hereIsYourPort;
    ports.p1.postMessage('the worker is sending this');
    //value.hereIsYourPort.postMessage('the worker is sending this');
    ports.p1.postMessage('second message');
    ports.p1.close();
  })();
  */

  get_ports().then(() => {
    console.log(value.name);
    ports[value.name] = value.hereIsYourPort;
  })
  ports.p1.postMessage('the worker is sending this');
  ports.p1.close();
}
