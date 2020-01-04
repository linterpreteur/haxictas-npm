import axios from 'axios';
import {MenuCallback} from '../../scraper';

export async function menus(date: Date, callback: MenuCallback) {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const url = `http://mini.snu.kr/cafe/set/${dateString}`;
    return axios.get(url)
        .then(x => callback({data: x.data, date: date}))
        .catch(err => callback(null, err));
};
