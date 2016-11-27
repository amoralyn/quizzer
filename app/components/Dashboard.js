import React from 'react';
import {Link} from 'react-router';
import logo from './../img/quizzer.png';
import './../css/app.css';
import $ from 'jquery';

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props);
    this.handleAddQuiz = this.handleAddQuiz.bind(this);
  }

  handleAddQuiz(e) {
    e.preventDefault();

  }

  render() {
    return (
      <div  className='App'>
        <div className='Dashboard-header'>
          <img src={logo} className='quizzer-logo' alt='logo'/>
        </div>
        <section className='dashboard-body container'>
          <div>
            <Link to="/create-quiz" className="btn btn-success ">Create quiz</Link>
          </div>
        </section>
      </div>
    )
  }
}