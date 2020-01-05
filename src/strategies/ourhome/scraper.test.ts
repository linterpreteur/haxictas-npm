import {menus, cafeterias} from './scraper';
import axios from 'axios-client';

describe(menus, () => {
  it('formats URL', () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const url = `https://dorm.snu.ac.kr/dk_board/facility/food.php?start_date2=${date.getTime() / 1000}`;

    menus(date);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.get).toBeCalledWith(url, expect.anything());
  });

  it('invokes callback on success', async () => {
    const date = new Date(0);
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res);

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

describe(cafeterias, () => {
  it('triggers HTTP request', () => {
    const url = 'https://dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';

    cafeterias();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.get).toBeCalledWith(url, expect.anything());
  });

  it('invokes callback on success', async () => {
    const res = 'response';
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce({data: res});

    const result = await cafeterias();

    expect(result).toEqual(res);
  });

  it('invokes callback on error', () => {
    const err = new Error();
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    const result = cafeterias();

    expect(result).rejects.toEqual(err);
  });
});
