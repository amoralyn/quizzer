(() => {
  'use strict';

  const User = require('./../models/user.model');
  const Quiz = require('./../models/quiz.model');

  module.exports ={
    createNewTask(req, res) {
      let userId = req.decoded.id;
      let quiz = new Quiz({
        name: req.body.name,
        description: req.body.description
      });

      function addQuizIdToUser(id, quiz) {
        let update = {
          $push: {quizzes: id}
        };

        return User
          .findByIdAndUpdate(req.decoded.id, update)
          .exec()
          .populate('quizzes')
      }
      quiz.save()
        .then((task) => {
          return
        })
    }
  };
})();