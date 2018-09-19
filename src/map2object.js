Array.prototype.map2object = function(fn) {
    let obj = {};
    this.forEach(it => {
        [key, value] = fn(it);
        obj[key] = value;
    });
    return obj;
}
