import React from 'react';
import {Link} from 'react-router';
import logo from './../img/quizzer.png';
import './../css/app.css';
import $ from 'jquery';
import './node_modules/dist/css/bootstrap.min.css';

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props);
    this.deleteQuiz = this.deleteQuiz.bind(this);
    this.state = {
      userQuizList: []
    }
  }

  componentWillMount() {
    this.fetchUserQuizzes();
  }

  fetchUserQuizzes() {
    let token = localStorage.getItem('x-access-token');
    let userId = localStorage.getItem('userId');
    let userQuizzesUrl = 'http://localhost:3000/api/user/' + userId + '/quizzes';

    $.ajax(userQuizzesUrl, {
      method: 'GET',
      headers: {
        'x-access-token': token
      }
    }).done((res) => {
      this.setState({
        userQuizList: res
      })
    });
  }

  deleteQuiz(quizId) {
    let deleteQuizUrl = "http://localhost:3000/api/quiz/" + quizId;
    let token = localStorage.getItem('x-access-token');

    $.ajax(deleteQuizUrl, {
      method: 'DELETE',
      headers: {
        'x-access-token': token
      }
    }).done((res) => {
      this.refs[quizId].style.display = "none";
    });
  }

  listUserQuizzes() {
    return this.state.userQuizList.map((item, index) => {
      return (
        <div className="panel panel-default" key={index} ref={item._id}>
          <div className="row panel-body">
            <div className="col-sm-6">
              <span>{ item.name }</span>
            </div>

            <div className="col-sm-6">
              <button className="btn btn-success">Edit</button>
            <button className="btn btn-danger" onClick={ this.deleteQuiz.bind(this, item._id) }>Delete</button>
            </div>
          </div>

        </div>
      )
    });
  }

  render() {
    return (
      <div  className='App'>
        <div className='Dashboard-header'>
          <img src={logo} className='quizzer-logo' alt='logo'/>
        </div>
        <section className='dashboard-body container'>
          <div className="jumbotron">
            <h2>Big Headline Here.</h2>
            <p>Lorem ipsum dolor si amet bla bla bla</p>

            <Link to="/create-quiz" className="btn btn-success ">Create quiz</Link>
          </div>

        </section>

        <section className="user-quizzes">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              { this.listUserQuizzes() }
            </div>
          </div>
        </section>
      </div>
    )
  }
}
