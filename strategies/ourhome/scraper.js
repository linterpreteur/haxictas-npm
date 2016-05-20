var httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    var url = 'dorm.snu.ac.kr/dk_board/facility/food.php';
    var userAgent = 'Haxictas/1.0';
    
    date = parseInt(date.getTime() / 1000, 10);
    
    httpHandler.get(url, {userAgent: userAgent, params: {start_date2: date}}, {end: callback});
};

module.exports.cafeterias = (callback) => {
    var url = 'dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';
    var userAgent = 'Haxictas/1.0';
    httpHandler.get(url, {userAgent: userAgent}, {end: callback});
};