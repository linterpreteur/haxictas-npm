var fs = require('fs');
var path = require('path');

var strategies = path.join(__dirname, 'strategies');
var cafeterias = fs.readdirSync(strategies).filter(file => {
    return fs.statSync(path.join(strategies, file)).isDirectory();
});

cafeterias.forEach((cafeteria) => {
    var parser = require(`${strategies}/${cafeteria}/parser`);
    var scraper = require(`${strategies}/${cafeteria}/scraper`);
    var exported = module.exports[cafeteria] = module.exports[cafeteria] || {};
    exported.menus = (dates, callback) => {
        scraper.menus(dates, (responseBody) => {
            parser.menus(responseBody, callback);
        });
    };
});