var cheerio = require('cheerio');
var prices = require('./prices');

module.exports.menus = (page, callback) => {
    var cached = this.cached = this.cached || {};
    var $ = cheerio.load(page);
    
    var pricePattern = /[\u24D0-\u24E9] [^ ]+/g;
    var parsePrice = (text) => {
        var price = {};
        var matches = text.match(pricePattern);
        if (!matches) return false;
        matches.forEach((m) => {
            var symbol = m.substring(0, m.indexOf(' '));
            var value = m.substring(m.indexOf(' ') + 1);
            if (value.match(/[0-9]원/)) {
                value = parseInt(value.replace(/[^0-9]/, ''), 10);
            }
            price[symbol] = value;
        });
        return price;
    };
    
    var trs = $('#Content tr');
    
    cached.price = parsePrice(trs.last().find('td').text()) || cached.price || prices;
    
    trs.filter((_, v) => $(v).text().trim()).each((i, tr) => {
        var tds = $(tr).find('td');
        
        var result = {
            cafeteria: null,
            meals: []
        };
        
        var priceSymbols = /[\u24D0-\u24E9]/g;
        var separators = /[/\n]+(?=^|[\u24D0-\u24E9])/;
        
        tds.filter(i => i % 2 === 0).each((i, td) => {
            td = $(td);
            var text = td.text();
            
            if (i === 0) {
                if (!text || text.match(pricePattern)) return false;
                td.html(td.html().replace(/(<.+?>.*)<br>.*(<.+?>)/, '$1$2'));
                result.cafeteria = td.text();
            } else {
                var items = {};
                var matches = text.match(priceSymbols);
                
                if (matches) {
                    text.replace(/\[.+?\]|\(.+?\)/, '')
                        .split(separators).forEach(text => {
                            var match = text.match(priceSymbols);
                            var symbol = match && match[0];
                            var item = text.replace(symbol, '').trim();
                            var price = cached.price[symbol] || prices.none;
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
    var $ = cheerio.load(page);
    
    // hard coding hell yeah!
    // have no idea whats going on
    var cafeteria = 'cafeteria';
    var floor = 'floor';
    var days = ['weekdays', 'saturday', 'holidays'];
    var categories = [
        cafeteria,
        'location',
        floor,
        'chairs',
        'target',
        days[0],
        days[1],
        days[2]
    ];
    var secondLineColumnOffset = 2;
    
    var trs = $('#Content tr');
    
    trs.filter((_, v) => $(v).text().trim()).each((i, tr) => {
        var tds = $(tr).find('td');
        var mod = tds.first().text().trim() ? 0 : 1;
        var result = {
            hours: []
        };
        
        var _floor = floor;
        var inserted = {};
        tds.filter(i => i % 2 === mod).each((i, td) => {
            var category = categories[i + (mod === 0 ? 0 : secondLineColumnOffset)];
            td = $(td);
            if (category === cafeteria) {
                td.html(td.html().replace(/(\s+|\n)/g, ' '));
                td.html(td.html().replace(/(<.+?>.*)<br>.*(<.+?>)/, '$1$2'));
            }
            var text = td.text().trim();
            
            if (categories.indexOf(category) < secondLineColumnOffset) {
                result[category] = text;
            } else {
                if (category === floor) {
                    _floor = text;
                } if (days.indexOf(category) != -1) {
                    text = text.replace(/ ?[-~] ?/g, '-');
                    
                    var hour = function(regex) {
                        var matches = text.match(regex);
                        if (!matches) return null;
                        return matches.map(x => x.match(/[0-9:]+/)[0]);
                    };
                    
                    var opens_at = hour(/[0-9]{2}:[0-9]{2}\-/g);
                    var closes_at = hour(/\-[0-9]{2}:[0-9]{2}/g);
                    
                    var dupe = inserted[_floor + text];
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