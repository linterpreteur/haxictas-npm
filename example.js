var haxictas = require('./');

var today = new Date();
var day = today.getDay();

haxictas.snuco.menus(today, (x) => console.log(day, x));
haxictas.ourhome.menus(today, (x, i) => console.log(i, x));