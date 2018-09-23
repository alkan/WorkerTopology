const {isMainThread} = require('worker_threads');

const src = isMainThread ? './src/main.js' : './src/worker.js';

module.exports = require(src);
