import {CafeteriaData, MenuData} from "../src/parser";

import load from '../src';
const haxictas = load(`${__dirname}/third_party`);

async function handleCafeterias(id: string, gen: AsyncGenerator<CafeteriaData, void, undefined>): Promise<void> {
    try {
        for await (const val of gen) {
            console.log(id, JSON.stringify(val, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

async function handleMenus(id: string, gen: AsyncGenerator<MenuData, void, undefined>): Promise<void> {
    try {
        for await (const {date, data} of gen) {
            console.log(id, date && date.toString(), JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

(async (): Promise<void> => {
    await handleCafeterias('snuco', haxictas.snuco.cafeterias());
    await handleCafeterias('ourhome', haxictas.ourhome.cafeterias());
    
    const date = new Date();
    await handleMenus('snuco', haxictas.snuco.menus(date));
    await handleMenus('ourhome', haxictas.ourhome.menus(date));
    await handleMenus('mini', haxictas.mini.menus(date));
    
    await handleMenus('new_cafeteria', haxictas.new_cafeteria.menus(date));
    await handleCafeterias('new_cafeteria', haxictas.new_cafeteria.cafeterias());
})();
