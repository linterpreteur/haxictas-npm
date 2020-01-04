import {ourhome} from '../../test/data';
import {menus, cafeterias} from './parser';

describe(menus, () => {
  it('parses given page', () => {
    const params = { data: ourhome.menus, date: new Date(0) };

    const gen = menus(params);

    Array.from(gen).forEach(x => expect(x).toMatchSnapshot());
  });
});

describe(cafeterias, () => {
  it('parses given page', () => {
    const params = ourhome.cafeterias;

    const gen = cafeterias(params);

    Array.from(gen).forEach(x => expect(x).toMatchSnapshot());
  });
});
