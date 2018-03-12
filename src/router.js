import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import MainPage from './pages/mainPage';
import RoomList from './pages/roomList';
import drawRoom from './pages/drawRoom';
import chessRoom from './pages/chessRoom';
import userInfo from './pages/userInfo'
const RouterConfig = () => (
  <Router>
    <div>
      <Route exact path="/" component={MainPage} />
      <Route  path="/roomlist" component={RoomList} />
      <Route  path="/chess" component={drawRoom} />
      <Route  path="/draw" component={chessRoom} />
      <Route path="/info" component={userInfo} />
    </div>
  </Router>
);
export default RouterConfig;