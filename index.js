const fs = require('fs');
const path = require('path');

const defaultStrategies = 'strategies';

function load(rootDirectory) {
    rootDirectory = path.join(__dirname, rootDirectory);
    const data = {};
    const cafeterias = fs.readdirSync(rootDirectory).filter(file => {
        return fs.statSync(path.join(rootDirectory, file)).isDirectory();
    });
    cafeterias.forEach(cafeteria => {
        const parser = require(`${rootDirectory}/${cafeteria}/parser`);
        const scraper = require(`${rootDirectory}/${cafeteria}/scraper`);
        data[cafeteria] = {
            menus: (date, callback) => {
                scraper.menus(date, function (responseBody, err) {
                    if (err) {
                        return callback(null, err);
                    }
                    const _callback = (...args) => {
                        callback(
                            args[0] && Object.assign({}, args[0], {date: date}),
                            ...args.slice(1)
                        )
                    }
                    parser.menus(responseBody, _callback);
                });
            },
            cafeterias: callback => {
                scraper.cafeterias((responseBody, err) => {
                    if (err) {
                        return callback(null, err);
                    }
                    parser.cafeterias(responseBody, callback);
                });
            }
        };
    });
    return data;
}

module.exports = function(...args) {
    const data = load(defaultStrategies);
    args.forEach(directory => {
        Object.assign(data, load(directory));
    });
    return data;
};
