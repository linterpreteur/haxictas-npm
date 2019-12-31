import {JSDOM} from 'jsdom';
import {normalize, querySelectorArray} from '../../lib/utils';
import {MenuParams, MenuCallback, CafeteriaParams, CafeteriaCallback, CafeteriaData} from '../../parser';

export function menus({data: page, date}: MenuParams, callback: MenuCallback) {
    const {document} = (new JSDOM(page)).window;

    function parseMenu(s: string): {[item: string]: number} {
        return s.split(/\n+/g)
            .map(x => x.match(/(.+?)\s*([\d,.]+원)$/) || x)
            .map(x => (typeof x === 'string') ? [x, '기타'] : [x[1], x[2]])
            .map(([k, v]) => [normalize(k), normalize(v)])
            .filter(x => x && x[0])
            .reduce((acc, [k, v]) => Object.assign({}, acc, {[k]: v}), {});
    }
    querySelectorArray(document, 'tbody tr').map(row => {
        const [cafeteria, breakfast, lunch, dinner] = querySelectorArray(row, 'td');
        const data = {
            cafeteria: normalize(cafeteria.textContent),
            meals: [
                parseMenu(breakfast.textContent),
                parseMenu(lunch.textContent),
                parseMenu(dinner.textContent)
            ]
        };
        callback({data: data, date: date});
    });
};

export function cafeterias(page: CafeteriaParams, callback: CafeteriaCallback) {
    const {document} = (new JSDOM(page)).window;

    const header = querySelectorArray(document, 'thead th:not([colspan])');
    const nameIndex = 0;
    const locationIndex = 1;

    const info: CafeteriaData = {
        cafeteria: undefined,
        location: undefined,
        hours: undefined
    };
    let cafeteria = null;
    let floor = null;
    querySelectorArray(document, 'tbody tr').forEach(row => {
        const cells = querySelectorArray(row, 'td');

        const isFullRow = cells.length >= header.length;
        if (isFullRow) {
            const name = cells[nameIndex];
            cafeteria = normalize(name.textContent);

            const location = cells[locationIndex];
            info[cafeteria] = Object.assign(
                {},
                info[cafeteria] || {},
                { location: normalize(location.textContent) }
            );

            cells.splice(cells.findIndex(x => x === name), 1);
            cells.splice(cells.findIndex(x => x === location), 1);
        }

        const mayContainFloor = cells.length > 5;
        if (mayContainFloor) {
            floor = normalize(cells[0].textContent);
            cells.splice(0, 1);
        }
        
        const [size, _, weekdays, saturday, holidays] = cells;

        const specialTypes = /(채식)/;
        const specialTypeMatches = size.textContent.match(specialTypes);
        if (specialTypeMatches) {
            floor = normalize(specialTypeMatches[1]);
        }

        function parseHours(s) {
            const numeralHours = /(\d+:\d+)-(\d+:\d+)/;
            const specialHours = /분식/;
            if (!s.match(numeralHours)) {
                return [normalize(s)];
            }
            if (s.match(specialHours)) {
                return [normalize(s)];
            }
            return s.split(/\n+/)
                .map(normalize)
                .map(x => x.match(numeralHours))
                .filter(x => x)
                .map(x => [x[1], x[2]]);
        }
        const hours = {
            weekdays: parseHours(weekdays.textContent),
            saturday: parseHours(saturday.textContent),
            holidays: parseHours(holidays.textContent)
        };

        function isEqualEntry(a, b) {
            return a.floor === b.floor &&
                a['opens_at'] === b['opens_at'] &&
                a['closes_at'] === b['closes_at'];
        }
        const aggregatedHours = Object.keys(hours)
            .reduce((acc, day) => {
                const newEntry = hours[day].map(item => ({
                    day: [day],
                    floor: floor,
                    'opens_at': (typeof item === 'string') ? item : item[0],
                    'closes_at': (typeof item === 'string') ? item : item[1],
                }));
                return acc.concat(newEntry);
            }, [])
            .reduce((acc, x) => {
                const equalEntry = acc.find(y => isEqualEntry(x, y));
                if (!equalEntry) {
                    return acc.concat(x);
                }
                equalEntry.day.push(...x.day);
                return acc;
            }, [])
            .map(x => ({conditions: x}));
        info[cafeteria] = Object.assign(
            {},
            info[cafeteria] || {},
            { hours: aggregatedHours }
        );
    });
    callback(info);
};
