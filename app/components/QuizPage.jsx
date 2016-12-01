import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Header from './Header.jsx';
import './../css/app.css';


export default class QuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateQuiz = this.handleCreateQuiz.bind(this);
  }

  handleCreateQuiz(e) {
    e.preventDefault();
    const name = this.refs.name.value;
    const description = this.refs.description.value;
    const token = localStorage.getItem('x-access-token');

    axios({
      method: 'POST',
      url: 'http://localhost:3000/api/quiz',
      data: {
        name,
        description,
      },
      headers: { 'x-access-token': token },
    }).then((res) => {
      console.log(res);
      localStorage.setItem('quizId', res.data._id);
      this.context.router.push('/create-questions');
    }).catch((err) => {
      this.refs.errMsg.textContent = JSON.parse(err.responseText).message;
      this.refs.errMsg.classList.add('alert', 'alert-danger');
    });
  }
  render() {
    return (
      <div className="App">
        <Header />
        <section className="quiz-form container">
          <div className="row">
            <form
              method="post" className="form col-sm-6 col-sm-offset-3"
              onSubmit={this.handleCreateQuiz}
            >
              <p ref="errMsg" />
              <div className="form-group">
                <label htmlFor="quiz-name">Name:</label>
                <input
                  type="text" placeholder="Add a quiz name" id="quiz-name"
                  ref="name" className="form-control" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                  type="text" placeholder="Some Content" id="description"
                  ref="description" className="form-control" required
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-success">Create Quiz</button>
              </div>
            </form>
          </div>
        </section>

      </div>
    );
  }
}

QuizPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
