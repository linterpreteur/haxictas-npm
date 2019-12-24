const haxictas = require('./')('third_party');

const cafeteriasCallback = info => {
    console.log(JSON.stringify(info, null, 2));
};

const menusCallback = (date, day, data) => {
    date = new Date(date);
    date.setDate(date.getDate() + (day - date.getDay()) % 7);
    data.date = date.valueOf();
    console.log(date.toString(), day, JSON.stringify(data, null, 2));
};

haxictas.snuco.cafeterias(cafeteriasCallback);
haxictas.ourhome.cafeterias(cafeteriasCallback);

const date = new Date();
haxictas.snuco.menus(date, menusCallback);
haxictas.ourhome.menus(date, menusCallback);

haxictas.new_cafeteria.menus(date, menusCallback);
haxictas.new_cafeteria.cafeterias(cafeteriasCallback);