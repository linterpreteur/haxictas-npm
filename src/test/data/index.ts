import * as fs from 'fs';
import * as path from 'path';

function read(...paths: string[]): string {
  const p = path.join(__dirname, ...paths);
  return fs.readFileSync(p).toString();
}

export const mini = read('mini.html');
export const snuco = {
  menus: read('snuco', 'menus.html'),
  cafeterias: read('snuco', 'cafeterias.html')
};
export const ourhome = {
  menus: read('ourhome', 'menus.html'),
  cafeterias: read('ourhome', 'cafeterias.html')
};
