import * as httpHandler from '../../lib/http-handler';
import {MenuCallback, CafeteriaCallback} from '../../scraper';

export async function menus(date: Date, callback: MenuCallback) {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${dateString}`;
    return httpHandler.get(
        url,
        null,
        (res, err) => callback({data: res, date: date}, err)
    )
};

export async function cafeterias(callback: CafeteriaCallback) {
    const url = 'http://snuco.snu.ac.kr/ko/node/20';
    return httpHandler.get(
        url,
        null,
        callback
    );
};
