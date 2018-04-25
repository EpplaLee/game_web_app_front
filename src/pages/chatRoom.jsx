import React, { Component } from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import Frame from './components/frame';
import { observer, inject } from 'mobx-react';

import { api } from '../utils/constants.js'

const Search = Input.Search;

@inject('RootStore') @observer
export default class ChatRoom extends Component {
  constructor(props) {
    super(props)
    this.chat_ws = new WebSocket(`ws://${api}:5000/ws/chatroom`);
    this.state = {
      chat_array: [],
    }
  }
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
    const { chat_array } = this.state;
    const child = <div>
      <div className="chat_wrapper">{chat_array.map( (i, n) => {
        return <div key={n} className="chat_item">{i}</div>
      })
      }
      </div>
      <Search 
      placeholder="单击此处编辑聊天内容" 
      enterButton="发送" 
      size="default"
      onSearch = { (value) => {
        this.chat_ws.send(value)
      }} 
      />
    </div>
    return <Frame child={child} header_title="公共聊天" />
  }
}