var cheerio = require('cheerio');
var prices = require('./prices');

module.exports.menus = (page, callback) => {
    var cached = this.cached = this.cached || {};
    var $ = cheerio.load(page);

    var parsePrice = (board) => {
        var price = {};
        var lis = board.find('li');
        if (lis.contents().length) return false;
        lis.each(li => {
            var tag = $(li).attr('class');
            var value = $(li).text();
            if (value.match(/[0-9]원/)) {
                value = parseInt(value.replace(/[^0-9]/, ''), 10);
            }
            price[tag] = value;
        });
        return price;
    };
    
    cached.price = parsePrice($('.board')) || cached.price || prices;
    
    var cafeterias = {};
    $('td[scope=rowgroup]').each((i, td) => {
        cafeterias[$(td).text().trim()] = i;
    });
    
    var dates = [];
    for (var i = 0; i < 7; i++) {
        var date = [];
        for (var j = 0; j < Object.keys(cafeterias).length; j++) {
            date.push({});
        }
        dates.push(date);
    }
    
    var day = 0; // 0 = SUN, 1 = MON, ..., 6 = SAT
    var meal = 0; // 0 = BFST, 1 = LNCH, 2 = DNNR
    var cafeteria = null;
    
    var meals = ['아침', '점심', '저녁'];
    var onRemarksCell;
            
    var isCafeteriaNameCell = (td) => $(td).attr('scope') === 'rowgroup';
    
    $('.t_col td').each((_, td) => {
        var lis = $(td).find('li');
        var cellText = $(td).text().trim();
        
        var cellEmpty = !cellText;
        var cellHasItems = !!lis.contents().length;
        var onTagCell = !cellEmpty && !cellHasItems;
        var onMenuItemCell = cellHasItems || (!onRemarksCell && cellEmpty);
        
        if (onTagCell) {
            onRemarksCell = (cellText === '비고');
            if (isCafeteriaNameCell(td)) cafeteria = cellText.trim();
            if (meals.indexOf(cellText) > -1) meal = meals.indexOf(cellText);
        } else if (onMenuItemCell) {
            var result = dates[day][cafeterias[cafeteria]];
            
            result['cafeteria'] = result['cafeteria'] || cafeteria;
            result['meals'] = result['meals'] || [{}, {}, {}];
            
            lis.each((_, li) => {
                var item = $(li).text().trim();
                var symbol = $(li).attr('class');
                var price = cached.price[symbol] || prices.none;
                
                result['meals'][meal][item] = price;
            });
            
            day = (day + 1) % 7;
        }
    });
    
    dates.forEach((date, day) => {
        date.forEach(cafeteria => {
            callback(day, cafeteria);
        });
    });
};

module.exports.cafeterias = (page, callback) => {
    var $ = cheerio.load(page);
    var tables = $('.basic_tbl').filter(i => i < 2);
    
    var onBreakPattern = /\(방학중 ([0-9]{2}:[0-9]{2})\)/;
    
    tables.each((i, table) => {
        var result = {
            cafeteria: i === 0 ? '919동' : '아워홈',
            hours: []
        };
        
        $(table).find('tr').each((i, tr) => {
            var tds = $(tr).find('td');
            if (i > 3) {
                result.location = tds.first().text().trim();
            } else {
                var search = function(days) {
                    for (var i = 0; i < result.hours.length; i++) {
                        var target = result.hours[i];
                        if (target.conditions.day.every(x => days.indexOf(x) != -1) &&
                            days.every(x => target.conditions.day.indexOf(x) != -1)) {
                            return target;
                        }
                    }
                    return null;
                };
                
                var update = function(days, hours) {
                    var found = search(days);
                    if (!found) {
                        found = {
                            conditions: {day: days},
                            opens_at: [],
                            closes_at: []
                        };
                        result.hours.push(found);
                    }
                    found.opens_at.push(hours[0].trim());
                    found.closes_at.push(hours[1].trim());
                };
                
                tds.each((i, td) => {
                    var text = $(td).text().trim();
                    var tokens = () => text.split('~');
                    var days = [i === 0 ? 'weekdays' : 'weekends'];
                    
                    if ($(td).attr('colspan') == 2) {
                        days = ['weekdays', 'weekends'];
                    }
                    
                    if (text.indexOf('방학중') != -1) {
                        var onBreakTokens = tokens().map(token => {
                            var match = token.match(onBreakPattern);
                            return (match && match[1]) || token;
                        });
                        
                        update(days.concat('break'), onBreakTokens);
                        
                        text = text.replace(onBreakPattern, '');
                    }
                    update(days, tokens());
                });
            }
        });
        callback(result);
    });
};