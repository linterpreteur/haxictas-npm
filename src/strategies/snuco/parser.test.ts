import {snuco as html} from '../../test/data';
import {menus, cafeterias} from './parser';

describe(menus, () => {
  it('parses given page', () => {
    const params = {data: html.menus, date: new Date(0)};

    const gen = menus(params);

    Array.from(gen).forEach(x => expect(x.data).toMatchSnapshot());
  });
});

describe(cafeterias, () => {
  it('parses given page', () => {
    const params = html.cafeterias;

    const gen = cafeterias(params);

    Array.from(gen).forEach(x => expect(x).toMatchSnapshot());
  });
});
