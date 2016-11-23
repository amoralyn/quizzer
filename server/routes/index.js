(() => {
  'use strict';

  const userRoutes = require('./user.route');
  const quizRoutes = require('./quiz.route');
  const questionRoutes = require('./question.route');

  module.exports = (router) => {
    userRoutes(router);
    quizRoutes(router);
    questionRoutes(router);
  };

})();
