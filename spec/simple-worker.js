const {ports} = require('../index.js');

ports.main.once('message', (msg) => {
    console.log('Main thread says:', msg);
    ports.main.postMessage('Hello main thread');
});
