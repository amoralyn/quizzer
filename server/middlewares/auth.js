const config = require('./../config/environment.js');
const jwt = require('jsonwebtoken');
const Quiz = require('./../models/quiz.model');
const Question = require('./../models/question.model');

module.exports = {

  middleware(req, res, next) {
    // check header, url parameters or post parameters for token
    const token = req.body.token || req.query.token ||
      req.headers['x-access-token'];

    if (token) {
      // verify secret
      jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: err,
            message: 'Failed to authenticate token',
          });
        }
          // if everything is good
        req.decoded = decoded;
        return next();
      });
    } else {
      // if no token is found
      return res.status(403).send({
        message: 'No token provided',
      });
    }
  },
  quizAccess(req, res, next) {
    Quiz.findOne({ _id: req.params.id })
      .exec()
      .then((quiz) => {
        if (!quiz) {
          return res.json({
            status: 404,
            message: 'No quiz found',
          });
        }
        if (req.decoded.id !== quiz.owner.toString()) {
          return res.status(403).json({
            message: 'Access Denied',
          });
        }
        next();
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  questionAccess(req, res, next) {
    console.log('here first');
    Question.findOne({ id: req.params.id, quizId: req.params.quizId })
      .exec()
      .then((question) => {
        console.log('next');
        if (!question) {
          console.log('then here');
          return res.json({
            status: 404,
            message: 'No question found',
          });
        }
        if (req.params.quizId !== question.quizId.toString()) {
          return res.status(403).json({
            message: 'Access Denied',
          });
        }
        console.log('lastly');
        next();
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

};
