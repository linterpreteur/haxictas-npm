import * as https from 'https';
import * as qs from 'querystring';
import axios from 'axios';
import {Scraper} from '../../scraper';

export const menus: Scraper['menus'] = async function (date) {
    const url = 'https://dorm.snu.ac.kr/dk_board/facility/food.php';
    
    const startDate = date.getTime() / 1000;
    
    const query = qs.stringify({'start_date2': startDate});
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    const opts = {httpsAgent: httpsAgent};
    return axios.get(`${url}?${query}`, opts)
        .then(x => ({data: x.data as string, date}));
};

export const cafeterias: Scraper['cafeterias'] = async function cafeterias() {
    const url = 'https://dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });
    const opts = {httpsAgent: httpsAgent};
    return axios.get(url, opts)
        .then(x => x.data as string);
};
