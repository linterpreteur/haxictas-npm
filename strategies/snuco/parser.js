const cheerio = require('cheerio');
const {JSDOM} = require('jsdom');
const prices = require('./prices');
const {normalize, querySelectorArray} = require('../../lib/utils');

module.exports.menus = ({data: page}, callback) => {
    const cached = this.cached = this.cached || {};
    const $ = cheerio.load(page);
    
    const pricePattern = /[\u24D0-\u24E9] [^ ]+/g;
    const parsePrice = (text) => {
        const price = {};
        const matches = text.match(pricePattern);
        if (!matches) return false;
        matches.forEach((m) => {
            const symbol = m.substring(0, m.indexOf(' '));
            const value = m.substring(m.indexOf(' ') + 1);
            if (value.match(/[0-9]원/)) {
                value = parseInt(value.replace(/[^0-9]/, ''), 10);
            }
            price[symbol] = value;
        });
        return price;
    };
    
    const trs = $('#Content tr');
    
    cached.price = parsePrice(trs.last().find('td').text()) || cached.price || prices;
    
    trs.filter((_, v) => $(v).text().trim()).each((i, tr) => {
        const tds = $(tr).find('td');
        
        const result = {
            cafeteria: null,
            meals: []
        };
        
        const priceSymbols = /[\u24D0-\u24E9]/g;
        const separators = /[/\n]+(?=^|[\u24D0-\u24E9])/;
        
        tds.filter(i => i % 2 === 0).each((i, td) => {
            td = $(td);
            const text = td.text();
            
            if (i === 0) {
                if (!text || text.match(pricePattern)) return false;
                td.html(td.html().replace(/(<.+?>.*)<br>.*(<.+?>)/, '$1$2'));
                result.cafeteria = td.text();
            } else {
                const items = {};
                const matches = text.match(priceSymbols);
                
                if (matches) {
                    text.replace(/\[.+?\]|\(.+?\)/, '')
                        .split(separators).forEach(text => {
                            const match = text.match(priceSymbols);
                            const symbol = match && match[0];
                            const item = text.replace(symbol, '').trim();
                            const price = cached.price[symbol] || prices.none;
                            items[item] = price;
                        });
                } else if (text.trim()) {
                    items[text.trim()] = prices.none;
                }
                result.meals.push(items);
            }
        });
        
        if (!result.cafeteria) return;
        
        callback({data: result});
    });
};

module.exports.cafeterias = (page, callback) => {
    const {document} = (new JSDOM(page)).window;

    const header = querySelectorArray(document, 'thead th:not([colspan])');
    const nameIndex = 0;
    const locationIndex = 1;

    const info = {};
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
                return [s];
            }
            if (s.match(specialHours)) {
                return [s];
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