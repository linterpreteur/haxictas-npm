import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import {Scraper} from "./scraper";
import {Parser, MenuData, CafeteriaData} from "./parser";

declare function require(id: string): any;

type Haxictas = {
    [id: string]: {
        menus: (date: Date) => AsyncGenerator<MenuData, void, undefined>,
        cafeterias: () => AsyncGenerator<CafeteriaData, void, undefined>
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
            menus: (scraper.menus && parser.menus) && async function* (date) {
                const iter = await scraper.menus(date)
                    .then(res => parser.menus(res));
                for await (const val of iter) {
                    yield val;
                }
            },
            cafeterias: (scraper.cafeterias && parser.cafeterias) && async function* () {
                const iter = await scraper.cafeterias()
                    .then(res => parser.cafeterias(res));
                for await (const val of iter) {
                    yield val;
                }
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
