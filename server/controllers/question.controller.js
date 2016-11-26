(() => {
  'use strict';

  const Quiz = require('./../models/quiz.model');
  const Question = require('./../models/question.model');

  module.exports = {
    createQuestion(req, res) {
      let quizId = req.params.quizId;
      let question = new Question({
        quizId: quizId,
        question: req.body.question,
        options: req.body.options,
        answer: req.body.answer
      });
      function addQuestionIdToQuiz(id, question) {
        let update ={
          $push: {questions: id}
        };

        return Quiz
          .findByIdAndUpdate(quizId, update)
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
      Question.find({quizId: req.params.quizId}, '-__v')
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
          res.status(200).json(question);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    editQuestion(req,res) {
      Question.findByIdAndUpdate({_id: req.params.id},
      req.body, {new:true})
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
