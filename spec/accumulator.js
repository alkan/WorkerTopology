const { workerData } = require('worker_threads');
const { ports } = require('../index');
const Data = function(name) {
    this.my_name = name;
    this.count = 0;
    this.sum = 0;
}

const data = new Data(workerData.name);

ports[workerData.source_port].on('message', (num) => {
    if (num === 0) {
        ports.reporter.postMessage(data);
        if (data.my_name === 'odd') {ports.prime.postMessage(num);}
        return;
    } else if (num === -1) {
        ports.main.postMessage(data);
        if (data.my_name === 'odd') {ports.prime.postMessage(num);}
        return;
    }
    data.count += 1;
    data.sum += num;
    if (data.my_name === 'odd' && isprime(num)) {
        ports.prime.postMessage(num);
    }
})

const isprime = function (x) {
      if (x < 2) {
          return false
      }
      if (x === 2) {
          return true
      }
      if (x % 2 === 0) {
          return false
      }
      for (let i = 3; i * i <= x; i += 2) {
          if (x % i === 0) {
              return false
          }
      }
      return true;
}
