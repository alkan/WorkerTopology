const { workerData } = require('worker_threads');
const { ports } = require('../index');
const Data = function(name) {
    this.my_name = name;
    this.count = 0;
    this.sum = 0;
}

const data = new Data(workerData.name);

ports[workerData.source_port].on('message', (num) => {
    if (num.task === 'dump') {
        ports.reporter.postMessage(data);
        if (data.my_name === 'odd') {ports.prime.postMessage(num);}
    } else if (num.task === 'status') {
        ports.main.postMessage(data);
        if (data.my_name === 'odd') {ports.prime.postMessage(num);}
    } else {
        data.count += 1;
        data.sum += num.val;
        if (data.my_name === 'odd' && isprime(num.val)) {
            ports.prime.postMessage(num);
        }
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
