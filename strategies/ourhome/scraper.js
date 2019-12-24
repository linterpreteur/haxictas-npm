const https = require('https');
const qs = require('querystring');
const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    const url = 'https://dorm.snu.ac.kr/dk_board/facility/food.php';
    
    const startDate = parseInt(date.getTime() / 1000, 10);
    
    const query = qs.stringify({'start_date2': startDate});
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    const opts = {httpsAgent: httpsAgent};
    const _callback = (responseBody, err) => callback({data: responseBody, day: date.getDay()}, err);
    httpHandler.get(
        `${url}?${query}`,
        opts,
        _callback
    );
};

module.exports.cafeterias = (callback) => {
    const url = 'https://dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    const opts = {httpsAgent: httpsAgent};
    httpHandler.get(
        url,
        opts,
        callback
    );
};