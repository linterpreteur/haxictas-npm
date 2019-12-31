import {mini as html} from '../../test/data';
import {menus} from './parser';

describe(menus, () => {
  it('parses given page', () => {
    const params = {data: html, date: new Date(0)};

    menus(params, (x, err) => {

      expect(err).not.toBe(expect.anything());
      expect(x.data).toMatchSnapshot();
    });
  });
});
