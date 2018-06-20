import React, { Component } from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import Frame from './components/frame';
import { observer, inject } from 'mobx-react';
import './chatRoom.css';

import { api } from '../utils/constants.js'

const Search = Input.Search;

@inject('RootStore') @observer
export default class ChatRoom extends Component {
  constructor(props) {
    super(props)
    this.chat_ws = new WebSocket(`ws://${api}/ws/chatroom`);
    this.state = {
      chat_array: [],
      input_str: ''
    }
  };
  componentDidMount() {
    this.chat_ws.onmessage = (evt) => {
      let chat_array = this.state.chat_array.slice();
      chat_array.push(evt.data)
      this.setState({ chat_array })
    }
  }
  componentWillUnmount() {

  }
  render() {
    const { chat_array, input_str } = this.state;

    const child = <div className="chat_body">
      <div className="chat_wrapper">{chat_array.map( (i, n) => {
        return <div key={n} className="chat_item">{i}</div>
      })
      }
      </div>
      <Search 
      placeholder="单击此处编辑聊天内容"
      value={input_str}
      enterButton="发送" 
      size="default"
      onChange={ (evt) => {
        this.setState({
          input_str: evt.target.value,
        })
      }}
      onSearch = { (value) => {
        this.chat_ws.send(value)
        this.setState({
          input_str: '',
        })
      }} 
      />
    </div>
    return <Frame child={child} header_title="公共聊天" />
  }
}