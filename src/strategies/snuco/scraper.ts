import * as httpHandler from '../../lib/http-handler';
import {MenuCallback, CafeteriaCallback} from '../../scraper';

export function menus(date: Date, callback: MenuCallback) {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${dateString}`;
    httpHandler.get(
        url,
        null,
        (res, err) => callback({data: res, date: date}, err)
    )
};

export function cafeterias(callback: CafeteriaCallback) {
    const url = 'http://snuco.snu.ac.kr/ko/node/20';
    httpHandler.get(
        url,
        null,
        callback
    );
};
