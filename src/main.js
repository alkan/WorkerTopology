const assert = require('assert');
const MAIN = 'main';
const {Worker, MessageChannel} = require('worker_threads');
require('./map2object');

const compose = (config) => {
    // Step 1: Parse worker definitinons
    let workerdefs = Object.entries(config.workers)
            .map2object(([name, conf]) => {
                assert(name !== MAIN, `'${MAIN}' is reserved for main process`);
                if (typeof conf === 'string') {
                    return [name, {path: conf, options: null, ports: {}}];
                } else if (typeof conf === 'object') {
                    assert(conf.path, `Source path of worker thread '${name}' is not supplied`);
                    return [name, { path: conf.path, options: conf.options, ports: {} }];
                } else {
                    throw('Unexpected worker definition of ' + name);
                }
            });
    workerdefs.main = {ports: {}};

    // Step 2: Parse channel definntions, create channels and ports, attach ports to workers
    config.channels.forEach(([w1, w2]) => {
        assert(workerdefs[w1], `There is no corresponding worker to ${w1}`);
        assert(workerdefs[w2], `There is no corresponding worker to ${w2}`);
        const { port1, port2 } = new MessageChannel();
        workerdefs[w1].ports[w2] = port2;
        workerdefs[w2].ports[w1] = port1;
    });

    // Step 3: Create worker instances, post ports and worker options
    let workers = Object.entries(workerdefs)
        .filter(([name, _]) => name !== MAIN)
        .map2object(([name, workerdef]) => {
            let worker = workerdef.options ?
                            new Worker(workerdef.path, workerdef.options) :
                            new Worker(workerdef.path);
            worker.postMessage(workerdef.ports, Object.values(workerdef.ports));
            return [name, worker];
        });

    // Step 4; Return the topology object
    return {workers: workers, ports: workerdefs.main.ports};
}

module.exports = compose;
