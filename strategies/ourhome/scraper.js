const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    const url = 'https://dorm.snu.ac.kr/dk_board/facility/food.php';
    const userAgent = 'Haxictas/1.0';
    
    date = parseInt(date.getTime() / 1000, 10);
    
    httpHandler.get(url, {userAgent: userAgent, params: {start_date2: date}}, {end: callback, error: (e) => { throw e; }});
};

module.exports.cafeterias = (callback) => {
    const url = 'https://dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';
    const userAgent = 'Haxictas/1.0';
    httpHandler.get(url, {userAgent: userAgent}, {end: callback, error: (e) => { throw e; }});
};