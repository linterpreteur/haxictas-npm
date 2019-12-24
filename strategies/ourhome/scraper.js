const https = require('https');
const qs = require('querystring');
const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    const url = 'https://dorm.snu.ac.kr/dk_board/facility/food.php';
    
    date = parseInt(date.getTime() / 1000, 10);
    
    const query = qs.stringify({'start_date2': date});
    httpHandler.get(
        `${url}?${query}`,
        null,
        callback
    );
};

module.exports.cafeterias = (callback) => {
    const url = 'https://dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';
    httpHandler.get(
        url,
        null,
        callback
    );
};