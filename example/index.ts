import {CafeteriaData, MenuData} from "../src/parser";

import load from '../src';
const haxictas = load(`${__dirname}/third_party`);

async function handleCafeterias(id: string, gen: AsyncGenerator<CafeteriaData, void, undefined>) {
    try {
        for await (const val of gen) {
            console.log(id, JSON.stringify(val, null, 2));
        };
    } catch (e) {
        console.error(e);
    }
}

async function handleMenus(id: string, gen: AsyncGenerator<MenuData, void, undefined>) {
    try {
        for await (const {date, data} of gen) {
            console.log(id, date && date.toString(), JSON.stringify(data, null, 2));
        };
    } catch (e) {
        console.error(e);
    }
}

(async () => {
    handleCafeterias('snuco', haxictas.snuco.cafeterias());
    handleCafeterias('ourhome', haxictas.ourhome.cafeterias());
    
    const date = new Date();
    handleMenus('snuco', haxictas.snuco.menus(date));
    handleMenus('ourhome', haxictas.ourhome.menus(date));
    handleMenus('mini', haxictas.mini.menus(date));
    
    handleMenus('new_cafeteria', haxictas.new_cafeteria.menus(date));
    handleCafeterias('new_cafeteria', haxictas.new_cafeteria.cafeterias());
})();
