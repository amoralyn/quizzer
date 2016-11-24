import React from 'react';
import {Link} from 'react-router';
import logo from './../img/quizzer.png';
import  './../css/app.css';

export default class SignUpPage extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className='App-name'>Quizzer!</h2>
        </div>
      </div>
    )
  }
}