const axios = require('axios');

const defaultOpts = {timeout: 5000}
const overridingHeaders = {'User-Agent': 'Haxictas/2.0'}

module.exports.get = (url, opts, callback) => {
    const headers = Object.assign({}, (opts && opts.headers) || {}, overridingHeaders)
    axios.get(url, Object.assign(defaultOpts, opts || {}, {headers: headers}))
        .then((res) => callback(res.data))
        .catch((e) => callback(null, e));
};

module.exports.post = (url, opts, callback) => {
    const headers = Object.assign({}, (opts && opts.headers) || {}, overridingHeaders)
    axios.post(url, Object.assign(defaultOpts, opts || {}, {headers: headers}))
        .then((res) => callback(res.data))
        .catch((e) => callback(null, e));
};
