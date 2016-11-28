import React from "react";
import { Link } from "react-router";
import logo from "./../img/quizzer.png";
import "./../css/app.css";


export default class Header extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('userId');
  }

  render() {
    return (
      <div className="Dashboard-header">
        <div className="logo">
          <Link to="/dashboard">
            <img src={logo} className="quizzer-logo" alt="logo"/>
          </Link>
        </div>

        <div className="user-action">
          <Link to="/logout" onClick={this.logout} className="btn btn-warning">Logout</Link>
        </div>
      </div>
    )
  }
}
