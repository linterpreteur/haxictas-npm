var httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    var userAgent = 'Haxictas/1.0';
    for (var n = 1; n <= 2; n++) {
        var url = `snuco.com/html/restaurant/restaurant_menu${n}.asp`;
        
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        mm = mm[1] ? mm : '0' + mm;
        var dd = date.getDate().toString();
        dd = dd[1] ? dd : '0' + dd;
        var _date = `${yyyy}-${mm}-${dd}`;
        
        var _callback = responseBody => callback(responseBody, date.getDay());
        httpHandler.get(url, {userAgent: userAgent, params: {date: _date}}, {end: _callback});
    }
};

module.exports.cafeterias = (callback) => {
    var url = 'snuco.com/html/restaurant/restaurant_management.asp';
    var userAgent = 'Haxictas/1.0';
    httpHandler.get(url, {userAgent: userAgent}, {end: callback});
};