import axios from 'axios';
import {MenuCallback, CafeteriaCallback} from '../../scraper';

export async function menus(date: Date, callback: MenuCallback) {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${dateString}`;
    return axios.get(url)
        .then(x => callback({data: x.data, date: date}))
        .catch(err => callback(null, err));
};

export async function cafeterias(callback: CafeteriaCallback) {
    const url = 'http://snuco.snu.ac.kr/ko/node/20';
    return axios.get(url)
        .then(x => callback(x.data))
        .catch(err => callback(null, err));
};
