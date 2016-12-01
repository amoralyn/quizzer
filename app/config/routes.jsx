import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import LandingPage from './../components/LandingPage.jsx';
import SignUpPage from './../components/SignUpPage.jsx';
import LoginPage from './../components/LoginPage.jsx';
import QuizPage from './../components/QuizPage.jsx';
import QuestionPage from './../components/QuestionPage.jsx';
import Dashboard from './../components/Dashboard.jsx';

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

const redirectIfQuizNotCreated = (nextState, replace, callback) => {
  if (!localStorage.getItem('quizId')) {
    replace('/create-quiz');
  }
  callback();
};

export default class Routes extends React.Component {
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/" component={LandingPage} onEnter={redirectIfLoggedIn} />
          <Route path="/logout" component={LandingPage} onEnter={redirectIfLoggedIn} />
          <Route path="/signup" component={SignUpPage} onEnter={redirectIfLoggedIn} />
          <Route path="/login" component={LoginPage} onEnter={redirectIfLoggedIn} />
          <Route path="/create-quiz" component={QuizPage} onEnter={redirectIfLoggedOut} />
          <Route path="/create-questions" component={QuestionPage} onEnter={redirectIfLoggedOut} />
          <Route path="/dashboard" component={Dashboard} onEnter={redirectIfLoggedOut} />
        </Router>
      </div>
    );
  }
}
