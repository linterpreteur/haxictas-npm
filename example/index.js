const haxictas = require('..')('./example/third_party');

const cafeteriasCallback = id => (info, err) => {
    if (err) {
        return console.error(err);
    }
    console.log(id, JSON.stringify(info, null, 2));
};

const menusCallback = id => (result, err) => {
    if (err) {
        return console.error(err);
    }
    let {date, day, data} = result;
    date = new Date(date);
    date.setDate(date.getDate() + (day - date.getDay()) % 7);
    data.date = date.valueOf();
    console.log(id, date.toString(), day, JSON.stringify(data, null, 2));
};

haxictas.snuco.cafeterias(cafeteriasCallback('snuco'));
haxictas.ourhome.cafeterias(cafeteriasCallback('ourhome'));

const date = new Date();
haxictas.snuco.menus(date, menusCallback('snuco'));
haxictas.ourhome.menus(date, menusCallback('ourhome'));
haxictas.mini.menus(date, menusCallback('mini'));

haxictas.new_cafeteria.menus(date, menusCallback('new_cafeteria'));
haxictas.new_cafeteria.cafeterias(cafeteriasCallback('new_cafeteria'));
