import {JSDOM} from 'jsdom';
import {MenuParams, MenuCallback} from '../../parser';
import {dedupe, querySelectorArray} from '../../lib/utils';

export function menus({data, date}: MenuParams, callback: MenuCallback) {
    const {document} = (new JSDOM(data)).window;

    const cafeterias = dedupe(
        querySelectorArray(document, 'td.head')
            .map((x) => x.textContent.replace(/\n/g, '').trim())
    );

    const menu: {[cafeteria: string]: {[item: string]: number}[]} = {};
    cafeterias.forEach(cafeteria => { menu[cafeteria] = [] });
    
    const cells = querySelectorArray(document, 'td');
    let meal = -1;
    let cafeteria = null;
    cells.forEach(cell => {
        const text = cell.textContent.trim();

        switch (text) {
            case '아침':
                meal = 0;
                return;
            case '점심':
                meal = 1;
                return;
            case '저녁':
                meal = 2;
                return;
        }

        const isMenuItem = text.match(/^\d+ /)
        if (!isMenuItem) {
            cafeteria = text;
            return;
        }

        const priceSelector = '.price';
        const priceSymbol = cell.querySelector(priceSelector).textContent.trim();
        const price = parseInt(priceSymbol, 10) * 100;
        const item = (() => {
            const tmp = cell.cloneNode(true) as typeof cell;
            const priceNode = tmp.querySelector(priceSelector);
            tmp.removeChild(priceNode);
            return tmp.textContent.replace(/\s{2,}/g, ' ').trim();
        })();
        menu[cafeteria][meal] = Object.assign(
            {},
            (menu[cafeteria][meal] || {}),
            { [item]: price }
        )
    });

    Object.keys(menu).forEach(cafeteria => {
        const meals = menu[cafeteria]
        const data = {
            cafeteria: cafeteria,
            meals: meals
        }
        callback({
            data: data,
            date: date
        })
    })
};

export function cafeterias() { /* no-op */ };
