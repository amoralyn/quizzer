import React from 'react';
import { Link } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import $ from 'jquery';
import logo from './../img/quizzer.png';
import './../css/app.css';


export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;

    axios.post('http://localhost:3000/api/users/login', {
      username,
      password,
    }).then((res) => {
      console.log(res);
      localStorage.setItem('x-access-token', res.data.token);
      localStorage.setItem('username', res.data.username);
      this.context.router.push('/dashboard');
    }).catch((err) => {
      console.log(err);
    });
  }

  showLoginMessage() {
    const message = localStorage.getItem('signup-successful-msg');

    if (message) {
      setTimeout(() => {
        localStorage.removeItem('signup-successful-msg');
      }, 4000);
      return message;
    }
  }

  addToastClass() {
    if (localStorage.getItem('signup-successful-msg')) {
      return 'alert alert-success';
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="App-name">Quizzer!</h2>
        </div>

        <p className={this.addToastClass()}>
          { this.showLoginMessage() }
        </p>

        <section className="sign-up-form container">
          <div className="row">
            <form
              method="post" className="form col-sm-6 col-sm-offset-3"
              onSubmit={this.handleLogin}
            >

              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text" placeholder="ade123456" id="username"
                  ref="username" className="form-control" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_password">Password:</label>
                <input
                  type="password" placeholder="*********" ref="password"
                  id="user_password" className="form-control" required
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-success">Login</button>
              </div>

              <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

LoginPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
