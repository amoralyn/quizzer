(() => {
  'use strict';

  const User = require('./../models/user.model');
  const Quiz = require('./../models/quiz.model');

  module.exports ={
    createQuiz(req, res) {
      let owner = req.decoded.id;
      let quiz = new Quiz({
        name: req.body.name,
        description: req.body.description,
        owner: owner
      });

      function addQuizIdToUser(id, quiz) {
        let update = {
          $push: {quizzes: id}
        };

        return User
          .findByIdAndUpdate(req.decoded.id, update)
          .exec()
          .then(() => {
            res.status(200).json(quiz);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
      quiz.save()
        .then((quiz) => {
          return addQuizIdToUser(quiz._id, quiz);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },

    getAllQuizzes(req, res) {
      Quiz.find({}, '-__v')
        .sort({ 'createdAt': 'descending' })
        .limit(parseInt(req.query.limit) || parseInt(10))
        .skip(parseInt(req.query.offset) || parseInt(0))
        .exec()
        .then((quizzes) => {
          if (!quizzes) {
            return res.status(404).json({
              message: 'No quizzes found'
            });
          }
          res.status(200).json(quizzes);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    getAQuiz(req, res) {
      Quiz.findById({_id: req.params.id})
        .exec()
        .then((quiz) => {
          if (!quiz) {
            return res.status(404).json({
              message: 'No quiz found'
            });
          }
          res.status(200).json(quiz);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    getQuizByUser(req, res) {
      Quiz.find({owner: req.params.userId})
        .exec()
        .then((quiz) => {
          if (!quiz) {
            return res.status(404).json({
              message: 'No quiz found'
            });
          }
          res.status(200).json(quiz);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    editQuiz(req, res) {
      Quiz.findByIdAndUpdate({_id: req.params.id},
      req.body, {new:true})
        .exec()
        .then((quiz) => {
          if (!quiz) {
            return res.status(404).json({
              message: 'No quiz found'
            });
          }
          res.status(200).json({
            quiz,
            message: 'Quiz successfully updated'
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    },
    deleteQuiz(req, res) {
      Quiz.findByIdAndRemove({_id: req.params.id})
        .exec()
        .then((quiz) => {
          if (!quiz) {
            return res.status(404).json({
              message: 'No quiz found'
            });
          }
          res.status(200).json({
            message: 'Quiz successfully deleted'
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  };
})();
