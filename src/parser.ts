export type MenuData = {
  data: {
      cafeteria: string,
      meals: {[item: string]: string|number}[]
  },
  date: Date
};

export type MenuParams = {data: string, date: Date};

export type CafeteriaData = {
  cafeteria: string,
  location: string,
  hours: {conditions: {day: string[], floor?: string, opens_at: string[], closes_at: string[]}}[]
};

export type CafeteriaParams = string;

export type Parser = {
  menus: (params: MenuParams) => Generator<MenuData, void, undefined>,
  cafeterias: (params: CafeteriaParams) => Generator<CafeteriaData, void, undefined>
}
