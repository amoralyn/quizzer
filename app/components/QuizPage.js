import React from 'react';
import logo from './../img/quizzer.png';
import './node_modules/dist/css/bootstrap.min.css';
import  './../css/app.css';
import $ from 'jquery';



export default class QuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateQuiz = this.handleCreateQuiz.bind(this);
  }

  handleCreateQuiz(e) {
    e.preventDefault();
    let name = this.refs.name.value;
    let description = this.refs.description.value;
    let token = localStorage.getItem('x-access-token');

    $.ajax('http://localhost:3000/api/quiz', {
      method: 'POST',
      data: {
        name: name,
        description: description
      },
      headers: {'x-access-token': token}
    }).done((res) => {
      localStorage.setItem('quizId', res._id);
      this.context.router.push('/create-questions');
    }).fail((err) => {
      this.refs.errMsg.textContent = JSON.parse(err.responseText).message;
      this.refs.errMsg.classList.add('alert', 'alert-danger');
    });
  }
  render() {
    return (
      <div className='App'>
        <div className='Dashboard-header'>
          <img src={logo} className='quizzer-logo' alt='logo'/>
        </div>
          <section className="quiz-form container">
            <div className="row">
              <form method="post" className="form col-sm-6 col-sm-offset-3" onSubmit={this.handleCreateQuiz}>
                <p ref="errMsg">
                </p>
                <div className="form-group">
                  <label htmlFor="quiz-name">Name:</label>
                <input type="text" placeholder="Add a quiz name" id="quiz-name" ref="name" className="form-control" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <input type="text" placeholder="Some Content" id="description" ref="description" className="form-control" required/>
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-success">Create Quiz</button>
                </div>
              </form>
            </div>
          </section>

      </div>
    )
  }
}

QuizPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};
