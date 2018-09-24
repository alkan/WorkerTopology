const { ports } = require('../index');

ports.even.on('message', (msg) => console.log(msg));
ports.odd.on('message', (msg) => console.log(msg));
ports.prime.on('message', (msg) => console.log(msg));
