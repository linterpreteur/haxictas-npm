const axios = require('axios');
const qs = require('querystring');

module.exports.get = (url, {userAgent, params: queryParams}, {end: onSuccess, error: onError}) => {
    const query = qs.stringify(queryParams);
    const opts = {headers: {'User-Agent': userAgent}};
    axios.get(`${url}?${query}`, opts)
        .then(onSuccess)
        .catch(onError);
};

module.exports.post = (url, {params: queryParams, userAgent}, {end: onSuccess, error: onError}) => {
    const query = qs.stringify(queryParams);
    const opts = {headers: {'User-Agent': userAgent}};
    axios.post(`${url}?${query}`, opts)
        .then(onSuccess)
        .catch(onError);
};