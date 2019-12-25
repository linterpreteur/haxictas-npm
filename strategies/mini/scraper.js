const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const url = `http://mini.snu.kr/cafe/set/${dateString}`;
    httpHandler.get(url, null, (res, err) => callback({data: res, day: date.getDay()}, err));
};

module.exports.cafeterias = () => { /* no-op */ };
