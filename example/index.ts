import {CafeteriaData, MenuData} from "../parser";

import load from '..';
const haxictas = load('./example/third_party');

const cafeteriasCallback = (id: string) => (info: CafeteriaData, err: {}) => {
    if (err) {
        return console.error(err);
    }
    console.log(id, JSON.stringify(info, null, 2));
};

const menusCallback = (id: string) => (result: MenuData, err: {}) => {
    if (err) {
        return console.error(err);
    }
    let {date, data} = result;
    console.log(id, date && date.toString(), JSON.stringify(data, null, 2));
};

haxictas.snuco.cafeterias(cafeteriasCallback('snuco'));
haxictas.ourhome.cafeterias(cafeteriasCallback('ourhome'));

const date = new Date();
haxictas.snuco.menus(date, menusCallback('snuco'));
haxictas.ourhome.menus(date, menusCallback('ourhome'));
haxictas.mini.menus(date, menusCallback('mini'));

haxictas.new_cafeteria.menus(date, menusCallback('new_cafeteria'));
haxictas.new_cafeteria.cafeterias(cafeteriasCallback('new_cafeteria'));
