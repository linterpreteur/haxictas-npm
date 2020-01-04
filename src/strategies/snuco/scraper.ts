import axios from 'axios';
import {Scraper} from '../../scraper';

export const menus: Scraper['menus'] = async function (date) {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${dateString}`;
    return axios.get(url)
        .then(x => ({data: x.data as string, date}))
};

export const cafeterias: Scraper['cafeterias'] = async function() {
    const url = 'http://snuco.snu.ac.kr/ko/node/20';
    return axios.get(url)
        .then(x => x.data as string)
};
