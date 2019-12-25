const qs = require('querystring');
const httpHandler = require('../../lib/http-handler');

module.exports.menus = (date, callback) => {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${dateString}`;
    httpHandler.get(
        url,
        null,
        (res, err) => callback({data: res, day: date.getDay()}, err)
    )
};

module.exports.cafeterias = (callback) => {
    const url = 'http://snuco.snu.ac.kr/ko/node/20';
    httpHandler.get(
        url,
        null,
        callback
    );
};