import axios from 'axios';
import {menus, cafeterias} from './scraper';

describe(menus, () => {
  it('formats URL', async () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const url = `http://snuco.snu.ac.kr/ko/foodmenu?field_menu_date_value[value][date]=${m}/${d}/${y}`;

    menus(date);

    expect(axios.get).toBeCalledWith(url);
  });

  it('invokes callback on success', async () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res);

    const result = await menus(date);

    expect(result).toEqual({...res, date});
  });

  it('invokes callback on error', async () => {
    const [y, m, d] = [1995, 1, 6];
    const date = new Date(y, m - 1, d);
    const err = new Error();
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    const result = menus(date);

    expect(result).rejects.toEqual(err);
  });
});

describe(cafeterias, () => {
  it('triggers HTTP request', () => {
    cafeterias();

    expect(axios.get).toBeCalled();
  });

  it('invokes callback on success', async () => {
    const res = 'response';
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce({data: res});

    const result = await cafeterias();

    expect(result).toEqual(res);
  });

  it('invokes callback on error', async () => {
    const err = new Error();
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    const result = cafeterias();

    expect(result).rejects.toEqual(err);
  });
});
