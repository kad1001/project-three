import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Home from './pages/Home/Home';
import Callback from './components/Callback/Callback';
import Auth from './components/Auth/Auth';
import Profile from './components/Profile/Profile'
import history from './utils/history';
import TimeCard from './pages/TimeCard/TimeCard';

const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
      <Router history={history}>
        <div>
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
          <Route path="/profile" render={(props) => <Profile auth={auth} {...props} />} />
          <Route path="/timecard" render={(props) => <TimeCard auth={auth} {...props} />} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
        </div>
      </Router>
  );
}
