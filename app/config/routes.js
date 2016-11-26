import React from 'react';
import {Router, Link, Route, IndexRoute, hashHistory} from 'react-router';
import LandingPage from './../components/LandingPage';
import SignUpPage from './../components/SignUpPage';
import LoginPage from './../components/LoginPage';
import QuizPage from './../components/QuizPage';
import QuestionPage from './../components/QuestionPage';
import Dashboard from './../components/Dashboard';

const redirectIfLoggedIn = (nextState, replace, callback) => {
  if (localStorage.getItem('x-access-token')) {
    replace('/dashboard');
  }
  callback();
};

const redirectIfLoggedOut = (nextState, replace, callback) => {
  if (!localStorage.getItem('x-access-token')) {
    replace('/');
  }
  callback();
};

export default class Routes extends React.Component{
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path='/' component={LandingPage} onEnter={redirectIfLoggedIn} />
          <Route path='/signup' component={SignUpPage} onEnter={redirectIfLoggedIn} />
          <Route path='/login' component={LoginPage} onEnter={redirectIfLoggedIn}/>
          <Route path='/create-quiz' component={QuizPage} onEnter={redirectIfLoggedOut} />
          <Route path='/create-questions' component={QuestionPage} onEnter={redirectIfLoggedOut} />
          <Route path='/dashboard' component={Dashboard} onEnter={redirectIfLoggedOut}/>
        </Router>
      </div>
    )
  }
}
