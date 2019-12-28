import * as fs from 'fs';
import * as path from 'path';
import {Scraper} from "./scraper";
import {Parser} from "./parser";

declare function require(id: string): any;

function load(rootDirectory: string) {
    rootDirectory = path.join(__dirname, rootDirectory);
    const data: {
        [id: string]: {
            menus: (date: Date, callback: (x?: {}, err?: {}) => void) => void,
            cafeterias: (callback: (x?: {}, err?: {}) => void) => void
        }
    } = {
        menus: undefined,
        cafeterias: undefined
    };
    const cafeterias = fs.readdirSync(rootDirectory).filter(file => {
        return fs.statSync(path.join(rootDirectory, file)).isDirectory();
    });
    cafeterias.forEach(cafeteria => {
        const parser: Parser = require(`${rootDirectory}/${cafeteria}/parser`);
        const scraper: Scraper = require(`${rootDirectory}/${cafeteria}/scraper`);
        data[cafeteria] = {
            menus: (date, callback) => {
                scraper.menus(date, function (responseBody, err) {
                    if (err) {
                        return callback(null, err);
                    }
                    parser.menus(responseBody, callback);
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

export default function(...args: string[]) {
    const data = load('strategies');
    args.forEach(directory => {
        Object.assign(data, load(directory));
    });
    return data;
};
