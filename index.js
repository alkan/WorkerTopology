const {isMainThread} = require('worker_threads');

const wmodule = require(isMainThread ? 'src/main.js' : 'src/worker.js');

module.exports = wmodule.exports;
