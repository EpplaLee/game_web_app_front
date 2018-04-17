import { observable, action } from 'mobx';
import { message } from 'antd'
import qs from 'qs';

class Lobby {
  @observable chess_rooms = [];
  @observable draw_rooms = [];
  @observable chess_players = [];
  @observable draw_players = [];

  constructor(root_store) {
    this.root_store = root_store;
    root_store.axios({
      method: 'get',
      url: '/lobby',
      withCredentials: false,
    }).then( res => {
      // if(res.data.msg === '查询成功') {
      //   this.root_store.User.islogin = true;
      //   this.root_store.User.nickname = '';
      //   this.root_store.User.phone_num = '';
      // }
      const { chess_rooms, draw_rooms, chess_players, draw_players} = res.data
      this.chess_rooms = chess_rooms || []
      this.draw_rooms = draw_rooms || []
      this.chess_players = chess_players || []
      this.draw_players = draw_players || []
    })
  }
  @action enterLobby = (type) => {
    let player_info = {
      phone_num: this.root_store.User.phone_num,
      nickname: this.root_store.User.nickname,
    }
    this.root_store.axios.post(`/lobby/enter?type=${type}`, qs.stringify({
      player: player_info,
    })).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        this.chess_rooms = res.data.chess_rooms
        this.draw_rooms = res.data.draw_rooms
      }
    })
  }
  @action leaveLobby = (type, player_info) => {
    this.root_store.axios.post(`/lobby/enter?type=${type}`, qs.stringify({
      player: player_info,
    })).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        this.chess_rooms = res.data.chess_rooms
        this.draw_rooms = res.data.draw_rooms
        this.chess_players = res.data.chess_players
        this.draw_players = res.data.draw_players
      }
    })
  }
}

export default Lobby;