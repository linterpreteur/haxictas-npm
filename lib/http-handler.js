var http = require('http');
var querystring = require('querystring');
var Iconv = require('iconv').Iconv;

var go = (options, callbacks) => {
    var callback = (name) => {
        return (arg) => {
            callbacks && callbacks[name] && callbacks[name](arg);
        };
    };
    
    var method = options['method'];
    var headers = method !== 'POST' ? {} : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': options['postMessage'].length
    };
    var userAgent = options['userAgent'];
    if (userAgent) {
        headers['User-Agent'] = userAgent;
    }
    if (method === 'POST') {
        var postMessage = options['postMessage'];
        delete options['postMessage'];
    }
    var encoding = options['encoding'];
    
    var url = options['url'].replace(/^https?:\/\//, '');
    if (options.params) {
        url += '?' + querystring.stringify(options['params']);
    }
    
    var hostname = url.substring(0, url.indexOf('/'));
    var path = url.substring(url.indexOf('/'));
    
    var req = http.request({
        hostname: hostname,
        path: path,
        port: 80,
        method: method,
        headers: headers
    }, (res) =>{
        if (res.statusCode != 200) {
            callback('error')(new Error(res.statusCode));
        }
        
        var buffers = [];
        var charsetTag = /<meta.+charset="?(.+?)[";]/;
        
        res.on('data', (chunk) => {
            buffers.push(chunk);
            if (!encoding) {
                var matches = Buffer.concat(buffers).toString().match(charsetTag);
                if (matches) {
                    var charset = matches[0].replace(charsetTag, '$1');
                    if (charset) {
                        encoding = charset.toUpperCase().trim();
                    } 
                }
            }
            callback('data')(chunk);
        });
        
        res.on('end', () => {
            var body = Buffer.concat(buffers);
            if (encoding && encoding !== 'UTF-8') {
                var iconv = new Iconv(encoding, 'UTF-8//TRANSLIT//IGNORE');
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