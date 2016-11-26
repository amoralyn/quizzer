import React from "react";
import logo from "./../img/quizzer.png";
import "./../css/app.css";
import $ from "jquery";




export default class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateQuestion = this.handleCreateQuestion.bind(this);
  }

  handleCreateQuestion(e) {
    e.preventDefault();
    let question = this.refs.question.value;
    let option1 = this.refs.option1.value;
    let option2 = this.refs.option2.value;
    let option3 = this.refs.option3.value;
    let answer = this.refs.answer.value;
    let token = localStorage.getItem("x-access-token");

    $.ajax("http://localhost:3000/api/question?quizId", {
      method: "POST",
      data: {
        question: question,
        options: [option1, option2, option3],
        answer: answer
      },
      headers: { "x-access-token": token }
    }).done((res) => {
      this.context.router.push("/quiz");
    }).fail((err) => {
      this.refs.errMsg.textContent = JSON.parse(err.responseText).message;
      this.refs.errMsg.classList.add("alert", "alert-danger");
    });
  }
  render() {
    return (
      <div className="App">
        <div className="Dashboard-header">
          <img src={logo} className="quizzer-logo" alt="logo"/>
        </div>
          <section className="quiz-form container">
            <div className="row">
              <form method="post" className="form col-sm-6 col-sm-offset-3" onSubmit={this.handleCreateQuiz}>
                <p ref="errMsg">
                </p>
                <div className="form-group">
                  <label htmlFor="quiz-name">Question:</label>
                  <input type="text" placeholder="What is a question?" id="quiz-name" ref="name" className="form-control" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Option 1:</label>
                  <input type="text" placeholder="Option 1" id="option1" ref="option1" className="form-control" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Option 2:</label>
                  <input type="text" placeholder="Option 2" id="option2" ref="option2" className="form-control" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Option 3:</label>
                  <input type="text" placeholder="Option 3" id="option3" ref="option3" className="form-control" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Correct Answer:</label>
                  <select className="form-control" ref="answer">
                    <option value="0">Option 1</option>
                    <option value="1">Option 2</option>
                    <option value="2">Option 3</option>
                  </select>
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-success">Create Question</button>
                </div>
              </form>
            </div>
          </section>

      </div>
    )
  }
}

QuestionPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};
