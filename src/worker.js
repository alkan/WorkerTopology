const {parentChannel, MessagePort} = require('worker_threads');

const PseudoPort = function() {
    this.events = {};
    this.deliveries = [];
    this.on = function(event, cb) {
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
    get(target, key, receiver) {
        if (! target[key]) {
            target[key] = new PseudoPort();
        }
        return target[key];
    }
}

let ports = new Proxy.revocable({}, handler)
parentPort.once('message', (value) => {
    ports = value;
});
