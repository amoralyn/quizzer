const Quiz = require('./../models/quiz.model');
const Question = require('./../models/question.model');

module.exports = {
  createQuestion(req, res) {
    const quizId = req.params.quizId;
    const question = new Question({
      quizId,
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
    });
    function addQuestionIdToQuiz(id, question) {
      const update = {
        $push: { questions: id },
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
        addQuestionIdToQuiz(question.id, question);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getAllQuestions(req, res) {
    Question.find({ quizId: req.params.quizId }, '-__v')
      .sort({ createdAt: 'descending' })
      .limit(parseInt(req.query.limit, 10))
      .skip(parseInt(req.query.offset, 0))
      .exec()
      .then((questions) => {
        if (!questions) {
          return res.status(404).json({
            message: 'No questions found',
          });
        }
        return res.status(200).json(questions);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getAQuestion(req, res) {
    Question.findById({ _id: req.params.id })
      .exec()
      .then((question) => {
        if (!question) {
          return res.status(404).json({
            message: 'No question found',
          });
        }
        return res.status(200).json(question);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  editQuestion(req, res) {
    Question.findByIdAndUpdate({ id: req.params.id },
    req.body, { new: true })
    .exec()
    .then((question) => {
      console.log('here');
      if (!question) {
        return res.status(404).json({
          message: 'No question found',
        });
      }
      return res.status(200).json({
        question,
        message: 'Question successfully updated',
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  },
  deleteQuestion(req, res) {
    console.log('here atm');
    Question.findByIdAndRemove({ id: req.params.questionId })
      .exec()
      .then((question) => {
        if (!question) {
          console.log(req.params.id);
          return res.status(404).json({
            message: 'No question found',
          });
        }
        return res.status(200).json({
          message: 'Question successfully deleted',
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
