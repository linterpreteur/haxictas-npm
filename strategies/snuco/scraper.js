const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    const userAgent = 'Haxictas/1.0';
    for (let n = 1; n <= 2; n++) {
        const url = `http://snuco.com/html/restaurant/restaurant_menu${n}.asp`;
        
        const yyyy = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        mm = mm[1] ? mm : '0' + mm;
        let dd = date.getDate().toString();
        dd = dd[1] ? dd : '0' + dd;
        const _date = `${yyyy}-${mm}-${dd}`;
        
        const _callback = responseBody => callback(responseBody, date.getDay());
        httpHandler.get(url, {userAgent: userAgent, params: {date: _date}}, {end: _callback, error: (e) => { throw e; }});
    }
};

module.exports.cafeterias = (callback) => {
    const url = 'http://snuco.com/html/restaurant/restaurant_management.asp';
    const userAgent = 'Haxictas/1.0';
    httpHandler.get(url, {userAgent: userAgent}, {end: callback, error: (e) => { throw e; }});
};