import {MenuCallback} from '../../scraper';
import * as httpHandler from '../../lib/http-handler';

export async function menus(date: Date, callback: MenuCallback) {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const url = `http://mini.snu.kr/cafe/set/${dateString}`;
    return httpHandler.get(url, null, (res, err) => callback({data: res, date: date}, err));
};
