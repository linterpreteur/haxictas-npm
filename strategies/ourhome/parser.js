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
            if (callback) callback(cafeteria, day);
        });
    });
};