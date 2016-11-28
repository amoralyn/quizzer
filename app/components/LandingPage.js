import React from 'react';
import {Link} from 'react-router';
import logo from './../img/quizzer.png';
import './node_modules/dist/css/bootstrap.min.css';
import  './../css/app.css';


export default class LandingPage extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className='App-name'>Quizzer!</h2>
        </div>
        <p className="App-intro">
          Welcome to Quizzer!
        </p>
        <Link to='/signup'>
          <button className='btn btn-default' type='button'>Sign Up</button>
        </Link>
        <Link to='/login'>
          <button className='btn btn-danger' type='button'>Login</button>
        </Link>
      </div>
    )
  }
}
