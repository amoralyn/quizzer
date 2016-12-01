const User = require('./../models/user.model');
const Quiz = require('./../models/quiz.model');

module.exports = {
  createQuiz(req, res) {
    const owner = req.decoded.id;
    const quiz = new Quiz({
      name: req.body.name,
      description: req.body.description,
      owner,
    });

    function addQuizIdToUser(id, quiz) {
      const update = {
        $push: { quizzes: id },
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
        addQuizIdToUser(quiz._id, quiz);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getAllQuizzes(req, res) {
    Quiz.find({}, '-__v')
      .sort({ createdAt: 'descending' })
      .limit(parseInt(req.query.limit, 10))
      .skip(parseInt(req.query.offset, 0))
      .exec()
      .then((quizzes) => {
        if (!quizzes) {
          return res.status(404).json({
            message: 'No quizzes found',
          });
        }
        return res.status(200).json(quizzes);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getAQuiz(req, res) {
    Quiz.findById({ _id: req.params.id })
      .exec()
      .then((quiz) => {
        if (!quiz) {
          return res.status(404).json({
            message: 'No quiz found',
          });
        }
        return res.status(200).json(quiz);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getQuizByUser(req, res) {
    User.findOne({ username: req.params.username })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
        return Quiz.find({ owner: user._id })
          .exec()
          .then((quiz) => {
            if (!quiz) {
              return res.status(404).json({
                message: 'No quiz found',
              });
            }
            return res.status(200).json(quiz);
          })
          .catch((err) => {
            res.status(500).json({ err,
              message: 'User does not exist' });
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  editQuiz(req, res) {
    Quiz.findByIdAndUpdate({ _id: req.params.id },
    req.body, { new: true })
      .exec()
      .then((quiz) => {
        if (!quiz) {
          return res.status(404).json({
            message: 'No quiz found',
          });
        }
        return res.status(200).json({
          quiz,
          message: 'Quiz successfully updated',
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  deleteQuiz(req, res) {
    Quiz.findByIdAndRemove({ _id: req.params.id })
      .exec()
      .then((quiz) => {
        if (!quiz) {
          return res.status(404).json({
            message: 'No quiz found',
          });
        }
        return res.status(200).json({
          message: 'Quiz successfully deleted',
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
