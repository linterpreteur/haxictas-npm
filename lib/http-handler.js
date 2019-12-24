const http = require('http');
const querystring = require('querystring');
const Iconv = require('iconv').Iconv;

const go = (options, callbacks) => {
    const callback = (name) => {
        return (arg) => {
            callbacks && callbacks[name] && callbacks[name](arg);
        };
    };
    
    const method = options['method'];
    const headers = method !== 'POST' ? {} : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': options['postMessage'].length
    };
    const userAgent = options['userAgent'];
    if (userAgent) {
        headers['User-Agent'] = userAgent;
    }
    if (method === 'POST') {
        const postMessage = options['postMessage'];
        delete options['postMessage'];
    }
    const encoding = options['encoding'];
    
    let url = options['url'].replace(/^https?:\/\//, '');
    if (options.params) {
        url += '?' + querystring.stringify(options['params']);
    }
    
    const hostname = url.substring(0, url.indexOf('/'));
    const path = url.substring(url.indexOf('/'));
    
    const req = http.request({
        hostname: hostname,
        path: path,
        port: 80,
        method: method,
        headers: headers
    }, (res) =>{
        if (res.statusCode != 200) {
            callback('error')(new Error(res.statusCode));
        }
        
        const buffers = [];
        const charsetTag = /<meta.+charset="?(.+?)[";]/;
        
        res.on('data', (chunk) => {
            buffers.push(chunk);
            if (!encoding) {
                const matches = Buffer.concat(buffers).toString().match(charsetTag);
                if (matches) {
                    const charset = matches[0].replace(charsetTag, '$1');
                    if (charset) {
                        encoding = charset.toUpperCase().trim();
                    } 
                }
            }
            callback('data')(chunk);
        });
        
        res.on('end', () => {
            let body = Buffer.concat(buffers);
            if (encoding && encoding !== 'UTF-8') {
                const iconv = new Iconv(encoding, 'UTF-8//IGNORE');
                body = iconv.convert(body);
            }
            body = body.toString('UTF-8');
            callback('end')(body);
        });
    });
    
    req.on('error', (e) => {
        callback('error')(e);
    });
    
    if (method === 'POST' && postMessage) req.write(postMessage);
    req.end();
};

module.exports.get = (url, options, callbacks) => {
    go({
        url: url,
        method: 'GET',
        encoding: options['encoding'],
        userAgent: options['userAgent'],
        params: options['params'],
    }, callbacks);
};

module.exports.post = (url, options, callbacks) => {
    go({
        url: url,
        method: 'POST',
        encoding: options['encoding'],
        params: options['params'],
        userAgent: options['userAgent'],
        postMessage: options['postMessage'],
    }, callbacks);
};