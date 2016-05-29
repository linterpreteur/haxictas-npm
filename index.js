var fs = require('fs');
var path = require('path');

var defaultStrategies = 'strategies';

function load(rootDirectory) {
    rootDirectory = path.join(__dirname, rootDirectory);
    var data = {};
    var cafeterias = fs.readdirSync(rootDirectory).filter(file => {
        return fs.statSync(path.join(rootDirectory, file)).isDirectory();
    });
    cafeterias.forEach(cafeteria => {
        var parser = require(`${rootDirectory}/${cafeteria}/parser`);
        var scraper = require(`${rootDirectory}/${cafeteria}/scraper`);
        data[cafeteria] = {
            menus: (date, callback) => {
                scraper.menus(date, function (responseBody) {
                    var args = [undefined, date];
                    args = args.concat(Array.prototype.slice.call(arguments, 1));
                    var _callback = Function.prototype.bind.apply(callback, args);
                    parser.menus(responseBody, _callback);
                });
            },
            cafeterias: callback => {
                scraper.cafeterias(responseBody => {
                    parser.cafeterias(responseBody, callback);
                });
            }
        };
    });
    return data;
}

module.exports = function() {
    var data = load(defaultStrategies);
    Array.prototype.forEach.call(arguments, directory => {
        Object.assign(data, load(directory));
    });
    return data;
};