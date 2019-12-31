import axios from 'axios';
import {menus, cafeterias} from './scraper';

describe(menus, () => {
  it('formats URL', () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const url = `https://dorm.snu.ac.kr/dk_board/facility/food.php?start_date2=${date.getTime() / 1000}`;

    menus(date, () => {});

    expect(axios.get).toBeCalledWith(url, expect.anything());
  });

  it('invokes callback on success', async () => {
    const date = new Date(0);
    const callback = jest.fn();
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res);

    await menus(date, callback);

    expect(callback).toBeCalledWith({...res, date}, undefined);
    expect(callback).not.toBeCalledWith(expect.anything(), expect.anything());
  });

  it('invokes callback on error', async () => {
    const date = new Date(0);
    const callback = jest.fn();
    const err = {};
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    await menus(date, callback);

    expect(callback).toBeCalledWith(expect.anything(), err);
  });
});

describe(cafeterias, () => {
  it('triggers HTTP request', () => {
    const url = 'https://dorm.snu.ac.kr/dk_board/dk_dormitory/dorm_content.php?ht_id=snu2_1_1';

    cafeterias(() => {});

    expect(axios.get).toBeCalledWith(url, expect.anything());
  });

  it('invokes callback on success', async () => {
    const res = 'response';
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce({data: res});
    const callback = jest.fn();

    await cafeterias(callback);

    expect(callback).toBeCalledWith(res);
    expect(callback).not.toBeCalledWith(expect.anything(), expect.anything());
  });

  it('invokes callback on error', async () => {
    const err = {};
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);
    const callback = jest.fn();

    await cafeterias(callback);

    expect(callback).toBeCalledWith(null, err);
  });
});
