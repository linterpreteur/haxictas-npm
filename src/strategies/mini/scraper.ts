import {Scraper} from '../../scraper';
import axios from 'axios-client';

export const menus: Scraper['menus'] = async function (date) {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const url = `http://mini.snu.kr/cafe/set/${dateString}`;
    return axios.get(url)
        .then(x => ({data: x.data as string, date: date}));
};
