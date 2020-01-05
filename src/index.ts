import * as fs from 'fs';
import * as path from 'path';
import {Scraper} from "./scraper";
import {Parser, MenuData, CafeteriaData} from "./parser";

declare function require(id: string): unknown;

type Haxictas = {
    [id: string]: {
        menus: (date: Date) => AsyncGenerator<MenuData, void, undefined>;
        cafeterias: () => AsyncGenerator<CafeteriaData, void, undefined>;
    };
};

function load(rootDirectory: string): Haxictas {
    const data: Haxictas = {};
    const rootPath = path.resolve(rootDirectory);
    const cafeterias = fs.readdirSync(rootPath).filter(file => {
        return fs.statSync(path.join(rootPath, file)).isDirectory();
    });
    cafeterias.forEach(cafeteria => {
        /* eslint-disable @typescript-eslint/no-var-requires */
        const parser = require(`${rootPath}/${cafeteria}/parser`) as Parser;
        const scraper = require(`${rootPath}/${cafeteria}/scraper`) as Scraper;
        /* eslint-enable @typescript-eslint/no-var-requires */
        data[cafeteria] = {
            menus: (scraper.menus && parser.menus) && async function* (date) {
                const iter = await scraper.menus(date)
                    .then(res => parser.menus(res));
                for await (const val of iter) {
                    yield val;
                }
            } as Haxictas['']['menus'],
            cafeterias: (scraper.cafeterias && parser.cafeterias) && async function* () {
                const iter = await scraper.cafeterias()
                    .then(res => parser.cafeterias(res));
                for await (const val of iter) {
                    yield val;
                }
            } as Haxictas['']['cafeterias']
        };
    });
    return data;
}

export default function(...args: string[]): Haxictas {
    const data = load('./src/strategies');
    args.forEach(directory => {
        Object.assign(data, load(directory));
    });
    return data;
}
