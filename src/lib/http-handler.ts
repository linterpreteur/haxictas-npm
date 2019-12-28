import axios, {AxiosRequestConfig} from 'axios';

const defaultOpts = {timeout: 5000}
const overridingHeaders = {'User-Agent': 'Haxictas/2.0'}

type HttpOptions = AxiosRequestConfig;
type HttpCallback = (data?: string, error?: {}) => void;

export function get(url: string, opts: HttpOptions, callback: HttpCallback) {
    const headers = Object.assign({}, (opts && opts.headers) || {}, overridingHeaders)
    axios.get(url, Object.assign(defaultOpts, opts || {}, {headers: headers}))
        .then((res) => callback(res.data))
        .catch((e) => callback(null, e));
};

export function post(url: string, opts: HttpOptions, callback: HttpCallback) {
    const headers = Object.assign({}, (opts && opts.headers) || {}, overridingHeaders)
    axios.post(url, Object.assign(defaultOpts, opts || {}, {headers: headers}))
        .then((res) => callback(res.data))
        .catch((e) => callback(null, e));
};
