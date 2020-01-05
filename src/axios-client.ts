import {version} from '../package.json'
import axios from 'axios';

export default (() => {
  const instance = axios.create();
  instance.defaults.timeout = 5000;
  instance.defaults.headers['User-Agent'] = `Haxictas/${version}`;
  return instance;
})();
