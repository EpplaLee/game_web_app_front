import { observable, action } from 'mobx';
import { message } from 'antd'
import qs from 'qs';

class User {
  @observable islogin = true;
  @observable nickname = '';
  @observable phone_num = '';
  @observable authority = null;
  constructor(root_store) {
    this.root_store = root_store;
  }
  @action signup = (password, phone_num, nickname) => {
    this.root_store.axios({
      method: 'post',
      url: '/signup', 
      data: qs.stringify({
        nickname,
        phone_num,
        password,
      }),
      // withCredentials: false,
    }).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        this.islogin = true;
        this.nickname = nickname;
        this.phone_num = phone_num;
        message.success(res.data.msg)
      }
    }).catch( err => {
      console.log(err);
    })
  }
  @action login = (phone_num, password) => {
    this.root_store.axios({
      method: 'post',
      url: '/login', 
      data: qs.stringify({
        phone_num,
        password,
      }),
      // withCredentials: false,
    }).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        this.islogin = true;
        this.nickname = res.data.nickname;
        this.phone_num = phone_num;
        message.success(res.data.msg)
      }
    }).catch( err => {
      console.log(err);
    })
  }
  @action checkLogin = () => {
    this.root_store.axios.get('/login/check').then( res => {
      if(res.data.err) {
        this.islogin = false;
        this.nickname = '';
        this.phone_num = '';
      } else {
        this.islogin = true;
        this.nickname = res.data.nickname;
        this.phone_num = res.data.phone_num;
      }
    })
  }
  @action clearAuthority = () => {
    this.authority = null;
  }
}

export default User;
