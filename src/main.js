ronst MAIN = 'main';
const {Worker, MessageChannel} = require('worker_threads');

const compose = (config) => {
    let workers = Object.entries(config.workers)
            .map(([name, conf]) => {
                if (name === MAIN) {
                    throw(`'${MAIN}' is reserved for main process`);
                }
                let workerdef = {};
                if (typeof conf === 'string') {
                    workerdef.path = conf;
                } else if (typeof conf === 'object') {
                    if (!conf.path) {
                        throw(`Source path of worker thread '${name}' is not supplied`);
                    }
                    workerdef.path = conf.path;
                    workerdef.data = conf.workerData;
                    workerdef.channels = [];
                }
                return workerdef;
            });
    workers.main = {};

    channels = {};
    Object.entries(config.channels)
        .forEach(([name,[w1, w2]]) => {
        if (!workers[w1]) {
            throw(`There is no corresponding worker to ${w1} of ${name}`);
        }
        if (!workers[w2]) {
            throw(`There is no corresponding worker to ${w2} of ${name}`);
        }
        [port1. port2] == new MessageChannel();
        message[name] = {};
        message[name][w1] = port1;
        message[name][w12 = port2;
        workers[w1].ports = (workers[w1].ports || []).concat([name, port1]);
        workers[w2].ports = (workers[w2].ports || []).concat([name, port2]);
    });
    let topology = [workers: workers, channels: channels: channels];
}
