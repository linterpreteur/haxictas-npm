import axios from 'axios';
import {menus} from './scraper';

describe(menus, () => {
  it('formats URL', () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);

    menus(date, () => {});

    expect(axios.get).toBeCalledWith(`http://mini.snu.kr/cafe/set/${y}-${m}-${d}`);
  });

  it('invokes callback on success', async () => {
    const date = new Date(0);
    const callback = jest.fn();
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res)

    await menus(date, callback);

    expect(callback).toBeCalledWith({...res, date});
    expect(callback).not.toBeCalledWith(expect.anything(), expect.anything());
  });

  it('invokes callback on error', async () => {
    const date = new Date(0);
    const callback = jest.fn();
    const err = new Error();
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    await menus(date, callback);

    expect(callback).toBeCalledWith(null, err);
  });
});
