import {MenuParams, CafeteriaParams} from './parser'

export type MenuCallback = (x?: MenuParams, err?: {}) => void;

export type CafeteriaCallback = (x?: CafeteriaParams, err?: {}) => void;

export type Scraper = {
  menus: (date: Date, callback: MenuCallback) => void,
  cafeterias: (callback: CafeteriaCallback) => void,
};
