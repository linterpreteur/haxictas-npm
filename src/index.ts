import * as fs from 'fs';
import * as path from 'path';
import {Scraper} from "./scraper";
import {Parser, MenuData, CafeteriaData} from "./parser";

declare function require(id: string): any;

type Haxictas = {
    [id: string]: {
        menus: (date: Date, callback: (x?: MenuData, err?: {}) => void) => void,
        cafeterias: (callback: (x?: CafeteriaData, err?: {}) => void) => void
    }
};

function load(rootDirectory: string) {
    const data: Haxictas = {};
    const rootPath = path.resolve(rootDirectory);
    const cafeterias = fs.readdirSync(rootPath).filter(file => {
        return fs.statSync(path.join(rootPath, file)).isDirectory();
    });
    cafeterias.forEach(cafeteria => {
        const parser: Parser = require(`${rootPath}/${cafeteria}/parser`);
        const scraper: Scraper = require(`${rootPath}/${cafeteria}/scraper`);
        data[cafeteria] = {
            menus: (scraper.menus && parser.menus) && function(date, callback) {
                scraper.menus(date, function (responseBody, err) {
                    if (err) {
                        return callback(null, err);
                    }
                    parser.menus(responseBody, callback);
                });
            },
            cafeterias: (scraper.cafeterias && parser.cafeterias) && function(callback) {
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

export default function(...args: string[]) {
    const data = load('./src/strategies');
    args.forEach(directory => {
        Object.assign(data, load(directory));
    });
    return data;
};
