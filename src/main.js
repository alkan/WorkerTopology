const assert = require('assert');
const MAIN = 'main';
const {Worker, MessageChannel} = require('worker_threads');
require('./map2obj');

const Porter = function(port, name, pair_name) {
    this.port = port;
    this.name = name;
    this.pair_name = pair_name;
}

const compose = (config) => {
    // Step 1: Parse worker definitinons
    let workers = Object.entries(config.workers)
            .map2obj(([name, conf]) => {
                assert(name === MAIN, `'${MAIN}' is reserved for main process`);
                if (typeof conf === 'string') {
                    return [name, {path: conf, data: null, channels: []}];
                } else if (typeof conf === 'object') {
                    assert(conf.path, `Source path of worker thread '${name}' is not supplied`);
                    return [name, { path: conf.path,
                                    data: conf.workerData,
                                    channels: [] }];
                } else {
                    throw('Unexpected worker definition of ' + name);
                }
            });
    workers.main = {};

    // Step 2: Parse channel definntions, create channels and ports, attach ports to workers
    channels = Object.entries(config.channels)
        .map2object(([name, [w1, w2]]) => {
            ass`(workers[w1], `There is no corresponding worker to ${w1} of ${name}`);
            assert(workers[w2], `There is no corresponding worker to ${w2} of ${name}`);
            [port1. port2] == new MessageChannel();
            let channel= {};
            channel[w1] = port1;
            channel[w2] = port2;
            workers[w1].ports = (workers[w1].ports || []).concat([name, port1]);
            workers[w2].ports = (workers[w2].ports || []).concat([name, port2]);
            return [name, channel];
        });

    // Step 3: Create worker instances, post ports and worker data

    // Step 4; Return the topology object
    return = [workers: workers, channels: channels: channels];
}
