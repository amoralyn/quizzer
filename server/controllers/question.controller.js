(() => {
  'use strict';

  const Quiz = require('./../models/quiz.model');
  const Question = require('./../models/question.model');

  module.exports = {
    createQuestion(req, res) {
      let quizId = req.query.id;
      let question = new Question({
        quizId: quizId,
        question: req.body.question,
        answers: req.body.answers,
        correctIndex: req.body.correctIndex
      });
      function addQuestionIdToQuiz(id, question) {
        let update ={
          $push: {questions: id}
        };

        return Quiz
          .findByIdAndUpdate(req.query.id, update)
          .exec()
          .then(() => {
            res.status(200).json(question);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
      question.save()
        .then(() => {
          return addQuestionIdToQuiz(question.id, question);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    getAllQuestions(req, res) {
      Question.find({}, '-__v')
        .sort({'createdAt': 'descending'})
        .limit(parseInt(req.query.limit) || parseInt(10))
        .skip(parseInt(req.query.offset) || parseInt(0))
        .exec()
        .then((questions) => {
          if (!questions) {
            return res.status(404).json({
              message: 'No questions found'
            });
          }
          res.status(200).json(questions);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    getAQuestion(req, res) {
      Question.findById({_id: req.params.id})
        .exec()
        .then((question)=> {
          if (!question) {
            return res.status(404).json({
              message: 'No question found'
            });
          }
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    getQuestionsByQuiz(req, res) {
      Question.find({quizId: req.params.quizId})
        .exec()
        .then((questions) => {
          if (!questions) {
            return res.status(404).json({
              message: 'No questions found'
            });
          }
          res.status(200).json(questions);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    editQuestion(req,res) {
      let update = {
        $set: {
          question: req.body.question,
          answers: req.body.answers,
          correctIndex: req.body.correctIndex
        }
      };
      Question.findByIdAndUpdate({_id: req.params.id},
      update, {new:true})
      .exec()
      .then((question) => {
        if (!question) {
          return res.status(404).json({
            message: 'No question found'
          });
        }
        res.status(200).json({
          question,
          message: 'Question successfully updated'
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
    },
    deleteQuestion(req, res) {
      Question.findByIdAndRemove({_id: req.params.id})
        .exec()
        .then((question) => {
          if (!question) {
            return res.status(404).json({
              message: 'No question found'
            });
          }
          res.status(200).json({
            message: 'Question successfully deleted'
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };
})();

