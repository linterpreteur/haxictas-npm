import {ourhome} from '../../test/data';
import {menus, cafeterias} from './parser';

describe(menus, () => {
  it('parses given page', () => {
    const params = { data: ourhome.menus, date: new Date(0) };

    menus(params, (x, err) => {

      expect(x).toMatchSnapshot();
      expect(err).not.toBe(expect.anything());
    });
  });
});

describe(cafeterias, () => {
  it('parses given page', () => {
    const params = ourhome.cafeterias;

    cafeterias(params, (x, err) => {

      expect(x).toMatchSnapshot();
      expect(err).not.toBe(expect.anything());
    });
  });
});
