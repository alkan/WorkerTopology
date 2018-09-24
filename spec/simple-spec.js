const topologydef = {
    "workers": {
        "test": {path: "./spec/simple-worker.js", options: {stdout: false}}
        //"test": "./spec/simple-worker.js"
    },
    "channels": [
        ["main", "test"]
    ]
}

const worker_topolopy = require('../index');

describe('construct a simple topology of threada', () => {
    it('should greet each other', (done) => {
        let topology = worker_topolopy(topologydef);
        topology.ports.test.postMessage('Hello worker');
        topology.ports.test.on('message', (msg) => {
            console.log('Reply from worker: ', msg);
            //topology.workers.test.terminate();
            done();
        });
        topology.workers.test.on('error', (err) => {throw(err)});
        setTimeout(() => {}, 1000);
    });
});
