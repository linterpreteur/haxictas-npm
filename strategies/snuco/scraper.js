var httpHandler = require('../../lib/http-handler');

module.exports.menus = (dates, callback) => {
    if (dates.constructor === Date) dates = [dates];
    for (var n = 1; n <= 2; n++) {
        var url = `snuco.com/html/restaurant/restaurant_menu${n}.asp`;
        var userAgent = 'Haxictas/Dev';
        
        dates.forEach((date) => {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            
            mm = mm[1] ? mm : '0' + mm;
            dd = dd[1] ? dd : '0' + dd;
            
            date = `${yyyy}-${mm}-${dd}`;
            
            httpHandler.get(url, {userAgent: userAgent, params: {date: date}}, {end: callback});
        });
    }
};