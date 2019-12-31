import {snuco as html} from '../../test/data';
import {menus, cafeterias} from './parser';

describe(menus, () => {
  it('parses given page', () => {
    const params = {data: html.menus, date: new Date(0)};

    menus(params, (x, err) => {

      expect(x.data).toMatchSnapshot();
      expect(err).not.toBe(expect.anything());
    });
  });
});

describe(cafeterias, () => {
  it('parses given page', () => {
    const params = html.cafeterias;

    cafeterias(params, (x, err) => {

      expect(x).toMatchSnapshot();
      expect(err).not.toBe(expect.anything());
    });
  });
});
