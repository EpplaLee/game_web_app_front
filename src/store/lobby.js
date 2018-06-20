import { observable, action } from 'mobx';
import { message } from 'antd'
import qs from 'qs';

class Lobby {
  @observable chess_rooms = {};
  @observable draw_rooms = {};
  @observable tetris_rooms = {};
  @observable chess_players = [];
  @observable draw_players = [];
  @observable tetris_players = [];
  @observable player_list = [];

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
      const { chess_rooms, draw_rooms, tetris_rooms, chess_players, draw_players, tetris_players} = res.data
      this.chess_rooms = chess_rooms || {};
      this.draw_rooms = draw_rooms || {};
      this.tetris_rooms = tetris_rooms || {};

      this.chess_players = chess_players || [];
      this.draw_players = draw_players || [];
      this.tetris_players = tetris_players || [];
    })
  }
  @action enterLobby = (type) => {
    let phone_num = this.root_store.User.phone_num;
    let nickname = this.root_store.User.nickname; 
    this.root_store.axios.get(`/lobby/enter?type=${type}&phone_num=${phone_num}&nickname=${nickname}`).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        if(type === 'draw') {
          this.draw_rooms = res.data.room;
        } else if( type === 'chess' ) {
          this.chess_rooms = res.data.room;
        } else if( type === 'tetris') {
          this.tetris_rooms = res.data.room;
        }
      }
    })
  }
  @action leaveLobby = (type, player_info) => {
    let phone_num = this.root_store.User.phone_num;
    let nickname = this.root_store.User.nickname;
    this.root_store.axios.get(`/lobby/enter?type=${type}&phone_num=${phone_num}&nickname=${nickname}`).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        this.chess_rooms = res.data.chess_rooms;
        this.draw_rooms = res.data.draw_rooms;
        this.tetris_rooms = res.data.tetris_rooms;

        this.chess_players = res.data.chess_players;
        this.draw_players = res.data.draw_players;
        this.tetris_players = res.data.tetris_players;
      }
    })
  }
  @action createRoom = (history, type, player) => {
    this.root_store.axios.post('/room/create', qs.stringify({
      type,
      ...player,
    })).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        this.chess_rooms = res.data.chess_rooms;
        this.draw_rooms = res.data.draw_rooms;
        this.tetris_rooms = res.data.tetris_rooms;
        history.push(`/roompage/${type}?room_num=${res.data.room_num}&action=0`)
        this.root_store.User.authority = 0
      }
    })
  }
  @action enterRoom = (history, type, player, room_num) => {
    this.root_store.axios.post('/room/enter', qs.stringify({
      type,
      ...player,
      room_num,
    })).then( res => {
      if(res.data.err) {
        message.error(res.data.err)
      } else {
        history.push(`/roompage/${type}?room_num=${room_num}&action=0`)
        this.chess_rooms = res.data.chess_rooms;
        this.draw_rooms = res.data.draw_rooms;
        this.tetris_rooms = res.data.tetris_rooms;
        this.root_store.User.authority = 1
      }
    })
  }
  @action refreshPlayer = (player_list) => {
    this.player_list = player_list;
  }
}

export default Lobby;