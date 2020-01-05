import {menus} from './scraper';
import axios from 'axios-client';

describe(menus, () => {
  it('formats URL', () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);

    menus(date);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.get).toBeCalledWith(`http://mini.snu.kr/cafe/set/${y}-${m}-${d}`);
  });

  it('invokes callback on success', async () => {
    const date = new Date(0);
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res)

    const result = await menus(date);

    expect(result).toEqual({...res, date});
  });

  it('invokes callback on error', () => {
    const date = new Date(0);
    const err = new Error();
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    const result = menus(date);

    expect(result).rejects.toEqual(err);
  });
});
