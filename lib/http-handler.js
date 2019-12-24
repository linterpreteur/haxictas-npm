const axios = require('axios');

const defaultHeaders = {'User-Agent': 'Haxictas/2.0'}

module.exports.get = (url, opts, callback) => {
    const headers = Object.assign({}, (opts && opts.headers) || {}, defaultHeaders)
    axios.get(url, Object.assign({}, opts || {}, {headers: headers}))
        .then((res) => callback(res.data))
        .catch((e) => callback(null, e));
};

module.exports.post = (url, opts, callback) => {
    const headers = Object.assign({}, (opts && opts.headers) || {}, defaultHeaders)
    axios.post(url, Object.assign({}, opts || {}, {headers: headers}))
        .then((res) => callback(res.data))
        .catch((e) => callback(null, e));
};