const qs = require('querystring');
const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    for (let n = 1; n <= 2; n++) {
        const url = `http://snuco.com/html/restaurant/restaurant_menu${n}.asp`;
        
        const yyyy = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        mm = mm[1] ? mm : '0' + mm;
        let dd = date.getDate().toString();
        dd = dd[1] ? dd : '0' + dd;
        const _date = `${yyyy}-${mm}-${dd}`;
        
        const _callback = (responseBody, err) => callback({data: responseBody, day: date.getDay()}, err);
        const query = qs.stringify({date: _date});
        httpHandler.get(
            `${url}?${query}`,
            null,
            _callback
        );
    }
};

module.exports.cafeterias = (callback) => {
    const url = 'http://snuco.com/html/restaurant/restaurant_management.asp';
    httpHandler.get(
        url,
        null,
        callback
    );
};