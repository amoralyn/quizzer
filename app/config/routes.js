import React from 'react';
import {Router, Link, Route, IndexRoute, hashHistory} from 'react-router';
import LandingPage from './../components/LandingPage';
import SignUpPage from './../components/SignUpPage';
import LoginPage from './../components/LoginPage';


export default class Routes extends React.Component{
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path='/' component={LandingPage}/>
          <Route path='/signup' component={SignUpPage}/>
          <Route path='/login' component={LoginPage}/>
        </Router>
      </div>
    )
  }
}