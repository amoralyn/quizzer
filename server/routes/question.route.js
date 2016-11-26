(() => {
  'use strict';

  const questionController = require('./../controllers/question.controller');
  const auth = require('./../middlewares/auth');

  module.exports = (router) => {
    router.use(auth.middleware);

    //route to create a new question
    router.route('/question')
      .post(questionController.createQuestion)
      .get(questionController.getAllQuestions);

    //route to get all questions of a specific user
    router.route('/user/:userId/questions')
      .get(questionController.getQuestionsByQuiz);

    //route to get a question by its Id
    router.route('/question/:id')
      .get(questionController.getAQuestion)
      .put(auth.userAccess,
        questionController.editQuestion)
      .delete(auth.userAccess,
        questionController.deleteQuestion);
  };
})();
