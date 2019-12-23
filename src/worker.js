const {parentPort} = require('worker_threads');

const PseudoPort = function() {
    this.events = {};
    this.deliveries = [];
    this.on = function(event, cb) {
        this.events[event] = cb;
    }
    this.once = function(event, cb) {
        this.events[event] = cb;
    }
    this.postMessage = function(value, transferList) {
        this.deliveries.push([value, transferList]);
    }
    this.transform = function(port) {
        Object.entries(this.events).forEach(([event, cb]) => port.on(event, cb));
        this.deliveries.forEach(([value, transferList]) => port.postMessage(value, transferList));
    }
}

const handler = {
    get(target, key) {
        if (! target[key] && typeof key === 'string' && key !== 'inspect') {
            target[key] = new PseudoPort();
        }
        return target[key];
    }
}

const Ports = function() {
    parentPort.once('message', (value) => {
        Object.entries(value).forEach(([name, port]) => {
            if (this[name]) {
                this[name].transform(port);
            }
            this[name] = port;
        });
        this.synced = true;
    });
    this.synced = false;
}

module.exports.ports = new Proxy(new Ports(), handler);
