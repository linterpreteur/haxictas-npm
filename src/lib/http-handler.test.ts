import axios from 'axios';
import {get, post} from './http-handler';

describe(get, () => {
  it('has default timeout', () => {
    const url = 'url';

    get(url, {}, () => {});

    expect(axios.get).toBeCalledWith(url, expect.objectContaining({timeout: expect.any(Number)}));
  });

  it('honors timeout argument', () => {
    const url = 'url';

    get(url, {timeout: 123}, () => {});

    expect(axios.get).toBeCalledWith(url, expect.objectContaining({timeout: 123}));
  });

  it('overrides any user agent header', () => {
    const url = 'url';
    const headers = {'User-Agent': 'FooBar'};

    get(url, {headers}, () => {});

    expect(axios.get).toBeCalledWith(url, expect.objectContaining({headers: expect.not.objectContaining(headers)}));
  });

  it('invokes callback on success', async () => {
    const url = 'url';
    const callback = jest.fn();
    const res = {data: 'response'};
    (axios.get as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res);

    await get(url, {}, callback);

    expect(callback).toBeCalledWith(res.data);
    expect(callback).not.toBeCalledWith(expect.anything(), expect.anything());
  });

  it('invokes callback on error', async () => {
    const url = 'url';
    const callback = jest.fn();
    const err = {};
    (axios.get as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    await get(url, {}, callback);

    expect(callback).toBeCalledWith(null, err);
  });
});

describe(post, () => {
  it('has default timeout', () => {
    const url = 'url';

    post(url, {}, () => {});

    expect(axios.post).toBeCalledWith(url, expect.objectContaining({timeout: expect.any(Number)}));
  });

  it('honors timeout argument', () => {
    const url = 'url';

    post(url, {timeout: 123}, () => {});

    expect(axios.post).toBeCalledWith(url, expect.objectContaining({timeout: 123}));
  });

  it('overrides any user agent header', () => {
    const url = 'url';
    const headers = {'User-Agent': 'FooBar'};

    post(url, {headers}, () => {});

    expect(axios.post).toBeCalledWith(url, expect.objectContaining({headers: expect.not.objectContaining(headers)}));
  });

  it('invokes callback on success', async () => {
    const url = 'url';
    const callback = jest.fn();
    const res = {data: 'response'};
    (axios.post as jest.Mock<Promise<{}>, []>).mockResolvedValueOnce(res);

    await post(url, {}, callback);

    expect(callback).toBeCalledWith(res.data);
    expect(callback).not.toBeCalledWith(expect.anything(), expect.anything());
  });

  it('invokes callback on error', async () => {
    const url = 'url';
    const callback = jest.fn();
    const err = {};
    (axios.post as jest.Mock<Promise<{}>, []>).mockRejectedValueOnce(err);

    await post(url, {}, callback);

    expect(callback).toBeCalledWith(null, err);
  });
});
