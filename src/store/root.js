import User from './user';
import Lobby from './lobby';
import axios from 'axios';
import { api } from '../utils/constants';

axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = `http://${api}/api`;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

class RootStore {
  constructor() {
    this.axios = axios;
    this.User = new User(this);
    this.Lobby = new Lobby(this);
  }
}

export default new RootStore()