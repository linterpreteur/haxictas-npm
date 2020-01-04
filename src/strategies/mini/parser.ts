import {JSDOM} from 'jsdom';
import {Parser} from '../../parser';
import {dedupe, querySelectorArray, normalize} from '../../lib/utils';

export const menus: Parser['menus'] = function* menus({data, date}) {
    const {document} = (new JSDOM(data)).window;

    const cafeterias = dedupe(
        querySelectorArray(document, 'td.head')
            .map((x) => normalize(x.textContent))
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

        const priceClass = 'price';
        const priceSelector = `.${priceClass}`;
        const isMenuItem = !!cell.querySelector(priceSelector);
        if (!isMenuItem) {
            cafeteria = text;
            return;
        }

        let price: number;
        cell.childNodes.forEach(child => {
            if (child instanceof child.ownerDocument.defaultView['Element']) {
                const isPrice = (child as Element).classList.contains(priceClass);
                if (!isPrice) {
                    return;
                }
                const priceSymbol = normalize(child.textContent);
                price = parseInt(priceSymbol, 10) * 100;
                return;
            }
            const item = normalize(child.textContent);
            menu[cafeteria][meal] = Object.assign(
                {},
                (menu[cafeteria][meal] || {}),
                { [item]: price }
            );
        });
    });

    for (const cafeteria of Object.keys(menu)) {
        const meals = menu[cafeteria]
        const data = {
            cafeteria: cafeteria,
            meals: meals
        }
        yield ({
            data: data,
            date: date
        });
    }
};
