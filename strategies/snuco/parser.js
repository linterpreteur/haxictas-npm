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
        
        var separators = /[/\n,]/;
        
        tds.filter(i => i % 2 === 0).each((i, td) => {
            var text = $(td).text();
            
            if (i === 0) {
                if (!text || text.match(pricePattern)) return false;
                result.cafeteria = text;
            } else {
                var items = {};
                var priceSymbols = /[\u24D0-\u24E9]/g;
                var matches = text.match(priceSymbols);
                
                if (matches) {
                    text.split(separators).forEach(text => {
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
        
        if (result.cafeteria && callback) callback(result);
    });
};