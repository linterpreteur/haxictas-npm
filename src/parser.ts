export type MenuData = {
  data: {
      cafeteria: string,
      meals: {[item: string]: string|number}[]
  },
  date: Date
};

export type MenuParams = {data: string, date: Date};
export type MenuCallback = (x?: MenuData, err?: {}) => void;

export type CafeteriaData = {
  cafeteria: string,
  location: string,
  hours: {conditions: {day: string[], floor?: string, opens_at: string[], closes_at: string[]}}[]
};

export type CafeteriaParams = string;
export type CafeteriaCallback = (x?: CafeteriaData, err?: {}) => void;

export type Parser = {
  menus: (params: MenuParams, callback: MenuCallback) => void,
  cafeterias: (params: CafeteriaParams, callback: CafeteriaCallback) => void
}
