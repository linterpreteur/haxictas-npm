const cheerio = require('cheerio');
const prices = require('./prices');

module.exports.menus = (page, callback) => {
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
        
        callback(result);
    });
};

module.exports.cafeterias = (page, callback) => {
    const $ = cheerio.load(page);
    
    // hard coding hell yeah!
    // have no idea whats going on
    const cafeteria = 'cafeteria';
    const floor = 'floor';
    const days = ['weekdays', 'saturday', 'holidays'];
    const categories = [
        cafeteria,
        'location',
        floor,
        'chairs',
        'target',
        days[0],
        days[1],
        days[2]
    ];
    const secondLineColumnOffset = 2;
    
    const trs = $('#Content tr');
    
    trs.filter((_, v) => $(v).text().trim()).each((i, tr) => {
        const tds = $(tr).find('td');
        const mod = tds.first().text().trim() ? 0 : 1;
        const result = {
            hours: []
        };
        
        const _floor = floor;
        const inserted = {};
        tds.filter(i => i % 2 === mod).each((i, td) => {
            const category = categories[i + (mod === 0 ? 0 : secondLineColumnOffset)];
            td = $(td);
            if (category === cafeteria) {
                td.html(td.html().replace(/(\s+|\n)/g, ' '));
                td.html(td.html().replace(/(<.+?>.*)<br>.*(<.+?>)/, '$1$2'));
            }
            const text = td.text().trim();
            
            if (categories.indexOf(category) < secondLineColumnOffset) {
                result[category] = text;
            } else {
                if (category === floor) {
                    _floor = text;
                } if (days.indexOf(category) != -1) {
                    text = text.replace(/ ?[-~] ?/g, '-');
                    
                    const hour = function(regex) {
                        const matches = text.match(regex);
                        if (!matches) return null;
                        return matches.map(x => x.match(/[0-9:]+/)[0]);
                    };
                    
                    const opens_at = hour(/[0-9]{2}:[0-9]{2}\-/g);
                    const closes_at = hour(/\-[0-9]{2}:[0-9]{2}/g);
                    
                    const dupe = inserted[_floor + text];
                    if (isFinite(dupe)) {
                        result.hours[dupe].conditions.day.push(category);
                    } else if (opens_at || closes_at) {
                        result.hours.push({
                            conditions: {
                                floor: _floor,
                                day: [category]
                            },
                            opens_at: opens_at,
                            closes_at: closes_at
                        });
                        inserted[_floor + text] = result.hours.length - 1;
                    }
                }
            }
        });
        callback(result);
    });
};