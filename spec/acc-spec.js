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

const rnd = (upper_bound) =>  Math.ceil(Math.random() * upper_bound);

describe('Accumulator', () => {
    it('collects even, odd and prime numbers at', (done) => {
        let topology = worker_topolopy(tdefs);
        const waitfor = (port) =>
            new Promise((resolve, reject) => {
                topology.ports[port].on('message', (result) => {
                    resolve(result);
                });
            })
            ;
        let even = waitfor('even');
        let odd = waitfor('odd');
        let prime = waitfor('prime');
        Promise.all([even, odd, prime])
            .then(([even_result, odd_result, prime_result]) => {
                expect(even_result.count + odd_result.count).toBe(PUSH_COUNT);
                console.log(prime_result);
                done();
            });
        for (let i=0; i<5; i+=1) {
            setTimeout(() => {
                for (let n=0; n<PUSH_COUNT/5; n+=1) {
                    const x = rnd(100);
                    topology.ports[(x % 2 === 0) ? 'even' : 'odd'].postMessage(x);
                }
                topology.ports.even.postMessage(0);
                topology.ports.odd.postMessage(0);
            }, i * 10);
        }
        setTimeout(() => {
            topology.ports.even.postMessage(-1);
            topology.ports.odd.postMessage(-1);
        }, 100);

    });
});
