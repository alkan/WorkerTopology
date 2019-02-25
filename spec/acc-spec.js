const worker_topolopy = require('../index');

const accpath = './spec/accumulator.js';
const PUSH_COUNT = 1000;

const tdefs = {
    workers: {
        even: {path: accpath, options: {workerData: {name: 'even', source_port: 'main'}}},
        odd: {path: accpath, options: {workerData: {name: 'odd', source_port: 'main'}}},
        prime: {path: accpath, options: {workerData: {name: 'prime', source_port: 'odd'}}},
        reporter: './spec/acc-reporter.js'
    },
    channels: [
        ['main', 'even'],
        ['main', 'odd'],
        ['main', 'prime'],
        ['odd', 'prime'],
        ['even', 'reporter'],
        ['odd', 'reporter'],
        ['prime', 'reporter']
    ]
}

// Generate a random integer between 3 and upper_bound
const rnd = (upper_bound) =>  Math.ceil(Math.random() * (upper_bound-2) + 2;

function wait_status(topology, done) {
    const waitfor = (port) =>
        new Promise((resolve, reject) => {
            topology.ports[port].on('message', (result) => {
                resolve(result);
            });
        });
    let even = waitfor('even');
    let odd = waitfor('odd');
    let prime = waitfor('prime');
    Promise.all([even, odd, prime])
        .then(([even_result, odd_result, prime_result]) => {
            expect(even_result.count + odd_result.count).toBe(PUSH_COUNT);
            console.log(prime_result);
            done();
        });
}

describe('Accumulator', () => {
    it('collects even, odd and prime numbers', (done) => {
        let topology = worker_topolopy(tdefs);
        wait_status(topology, done);
        for (let i=0; i<5; i+=1) {
            setTimeout(() => {
                for (let n=0; n<PUSH_COUNT/5; n+=1) {
                    const x = {task: 'accumulate', val: rnd(100)};
                    const port = topology.ports[(x.val % 2 === 0) ? 'even' : 'odd'];
                    port.postMessage(x);
                }
                topology.ports.even.postMessage({task: 'dump'});
                topology.ports.odd.postMessage({task: 'dump'});
            }, i * 10);
        }
        setTimeout(() => {
            topology.ports.even.postMessage({task: 'status'});
            topology.ports.odd.postMessage({task: 'status'});
        }, 100);

    });
});
