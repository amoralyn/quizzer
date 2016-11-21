(() => {
  'use strict';

    const quizController = require('./../controllers/quiz.controller');
    const auth = require('./../middlewares/auth');

    module.exports = (router) => {
      router.use(auth.middleware);

      //route to create a new quiz
      router.route('/quiz')
        .post(quizController.createQuiz)
        .get(quizController.getAllQuizzes);

      //route to get all quizzes of a specific user
      router.route('/user/:userId/quizzes')
        .get(quizController.getQuizByUser);

      //route to get a quiz by its Id
      router.route('/quiz/:id')
        .get(quizController.getAQuiz)
        .put(auth.userAccess,
          quizController.editQuiz)
        .delete(auth.userAccess,
          quizController.deleteQuiz);
    };
})();