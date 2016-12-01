import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../css/app.css';
import Header from './Header.jsx';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userQuizList: [],
    };
  }

  componentWillMount() {
    this.fetchUserQuizzes();
  }

  fetchUserQuizzes() {
    const token = localStorage.getItem('x-access-token');
    const username = localStorage.getItem('username');
    const userQuizzesUrl = `http://localhost:3000/api/user/${username}/quizzes`;

    axios({
      method: 'GET',
      url: userQuizzesUrl,
      headers: {
        'x-access-token': token,
      },
    }).then((res) => {
      this.setState({
        userQuizList: res,
      });
    });
  }

  deleteQuiz(quizId) {
    const deleteQuizUrl = `http://localhost:3000/api/quiz/${quizId}`;
    const token = localStorage.getItem('x-access-token');

    axios({
      method: 'DELETE',
      url: deleteQuizUrl,
      headers: {
        'x-access-token': token,
      },
    }).then((res) => {
      this.refs[quizId].style.display = 'none';
    });
  }

  listUserQuizzes() {
    return this.state.userQuizList.map((item, index) => (
      <div className="panel panel-default" key={index} ref={item._id}>
        <div className="row panel-body">
          <div className="col-sm-6">
            <span>{ item.name }</span>
          </div>

          <div className="col-sm-6">
            <button className="btn btn-success">Edit</button>
            <button
              className="btn btn-danger"
              onClick={this.deleteQuiz.bind(this, item._id)}
            >
              Delete
            </button>
          </div>
        </div>

      </div>
      ));
  }

  render() {
    return (
      <div className="App">
        <Header />
        <section className="dashboard-body container">
          <div className="jumbotron">
            <h2>Create your own quiz</h2>
            <p>Fashion, art, music, science, anything that comes to mind...</p>

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
    );
  }
}
