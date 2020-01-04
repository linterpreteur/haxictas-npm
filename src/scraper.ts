import {MenuParams, CafeteriaParams} from './parser'

export type Scraper = {
  menus: (date: Date) => Promise<MenuParams>,
  cafeterias: () => Promise<CafeteriaParams>,
};
