import React from 'react';
import { Link } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Header from './Header.jsx';
import './../css/app.css';


export default class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateQuestion = this.handleCreateQuestion.bind(this);

    this.state = {
      questionCount: 0,
    };
  }

  shouldDisable() {
    return this.state.questionCount < 1 ? true : false;
  }

  questionCount() {
    return this.state.questionCount;
  }

  handleCreateQuestion(e) {
    e.preventDefault();
    const questionForm = this.refs.questionForm;
    const question = this.refs.question.value;
    const option1 = this.refs.option1.value;
    const option2 = this.refs.option2.value;
    const option3 = this.refs.option3.value;
    const answer = this.refs.answer.value;
    const token = localStorage.getItem('x-access-token');
    const quizId = localStorage.getItem('quizId');
    const questionUrl = `http://localhost:3000/api/quiz/${quizId}/questions`;
    let questionCount;

    $.ajax(questionUrl, {
      method: 'POST',
      data: {
        question,
        options: [option1, option2, option3],
        answer,
      },
      headers: { 'x-access-token': token },
    }).done((res) => {
      questionCount = this.state.questionCount;
      this.setState({
        questionCount: (questionCount + 1),
      });
      questionForm.reset();
    }).fail((err) => {
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
              className="form col-sm-6 col-sm-offset-3" ref="questionForm"
              onSubmit={this.handleCreateQuestion}
            >
              <p ref="errMsg" />
              <div className="form-group">
                <label htmlFor="quiz-name">Question:</label>
                <input
                  type="text" placeholder="What is a question?" id="quiz-name"
                  ref="question" className="form-control" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Option 1:</label>
                <input
                  type="text" placeholder="Option 1" id="option1" ref="option1"
                  className="form-control" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Option 2:</label>
                <input
                  type="text" placeholder="Option 2" id="option2" ref="option2"
                  className="form-control" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Option 3:</label>
                <input
                  type="text" placeholder="Option 3" id="option3" ref="option3"
                  className="form-control" required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Correct Answer:</label>
                <select className="form-control" ref="answer">
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                </select>
              </div>

              <div className="form-group text-left">
                <button type="submit" className="btn btn-info">Add</button>

                <Link
                  to="/dashboard" className="btn btn-success"
                  disabled={this.shouldDisable()}
                >
                  Save Quiz
              </Link>
              </div>

              <p className="question-count">
                <strong>questions added:</strong> { this.questionCount() }
              </p>
            </form>
          </div>
        </section>

      </div>
    );
  }
}

QuestionPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
