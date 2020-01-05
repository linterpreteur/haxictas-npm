import {version} from '../package.json'
import axios, {AxiosInstance} from 'axios';

export default ((): AxiosInstance => {
  const instance = axios.create();
  instance.defaults.timeout = 5000;
  instance.defaults.headers['User-Agent'] = `Haxictas/${version}`;
  return instance;
})();
