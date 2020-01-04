import {mini as html} from '../../test/data';
import {menus} from './parser';

describe(menus, () => {
  it('parses given page', () => {
    const params = {data: html, date: new Date(0)};

    const gen = menus(params);

    Array.from(gen).forEach(x => expect(x.data).toMatchSnapshot());
  });
});
