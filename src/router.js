import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './pages/mainPage';
import RoomList from './pages/roomList';
import RoomPage from './pages/roomPage';
import userInfo from './pages/userInfo';
import DrawGame from './pages/drawGame';
import ChessGame from './pages/chessGame';
const RouterConfig = () => (
  <Router>
    <div>
      <Route exact path="/" component={MainPage} />
      <Route  path="/roomlist/:type" component={roomlist} />
      <Route  path="/roompage/:type" component={roompage} />
      <Route path="/info" component={userInfo} />
      <Route path="/draw" component={DrawGame} />
      <Route path="/chess" component={ChessGame} />
    </div>
  </Router>
);
const roomlist = ({ match }) => {
  return <RoomList type={ match.params.type } />
};
const roompage = ({ match }) => {
  return <RoomPage type={ match.params.type } />
};
export default RouterConfig;