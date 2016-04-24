var httpHandler = require('../../lib/http-handler');

module.exports.menus = (dates, callback) => {
    if (dates.constructor === Date) dates = [dates];
    var url = 'dorm.snu.ac.kr/dk_board/facility/food.php';
    var userAgent = 'Haxictas/Dev';
    
    var done = [];
    dates.forEach((date) =>{
        var dupe = done.length > 0 && done.every(checked => {
            return Math.abs(checked.getDate() - date.getDate()) < 7;
        });
        if (!dupe) {
            date = parseInt(date.getTime() / 1000, 10);
            httpHandler.get(url, {userAgent: userAgent, params: {start_date2: date}}, {end: callback});
            done.push(date);
        }
    });
};