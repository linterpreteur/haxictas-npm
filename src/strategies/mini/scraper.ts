import {MenuCallback} from '../../scraper';
import * as httpHandler from '../../lib/http-handler';

export function menus(date: Date, callback: MenuCallback) {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const url = `http://mini.snu.kr/cafe/set/${dateString}`;
    httpHandler.get(url, null, (res, err) => callback({data: res, date: date}, err));
};
