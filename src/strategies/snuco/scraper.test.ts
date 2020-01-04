import axios from 'axios';
import {menus, cafeterias} from './scraper';

describe(menus, () => {
  it('formats URL', () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const callback = () => {};
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${m}/${d}/${y}`;

    menus(date, callback);

    expect(axios.get).toBeCalledWith(url);
  });

  it('invokes callback on success', async () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res);
    const callback = jest.fn();

    await menus(date, callback);

    expect(callback).toBeCalledWith({...res, date});
    expect(callback).not.toBeCalledWith(expect.anything(), expect.anything());
  });

  it('invokes callback on error', async () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const err = {};
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);
    const callback = jest.fn();

    await menus(date, callback);

    expect(callback).toBeCalledWith(null, err);
  });
});

describe(cafeterias, () => {
  it('triggers HTTP request', () => {
    const callback = () => {};

    cafeterias(callback);

    expect(axios.get).toBeCalled();
  });

  it('invokes callback on success', async () => {
    const res = 'response';
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce({data: res});
    const callback = jest.fn();

    await cafeterias(callback);

    expect(callback).toBeCalledWith(res);
  });

  it('invokes callback on error', async () => {
    const err = {};
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);
    const callback = jest.fn();

    await cafeterias(callback);

    expect(callback).toBeCalledWith(null, err);
  });
});
