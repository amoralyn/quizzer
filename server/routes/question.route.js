const questionController = require('./../controllers/question.controller');
const auth = require('./../middlewares/auth');

module.exports = (router) => {
  router.use(auth.middleware);

  // route to create a new question
  router.route('/quiz/:quizId/questions')
    .post(questionController.createQuestion)
    .get(questionController.getAllQuestions);

  // route to get a question by its Id
  router.route('/quiz/:quizId/questions/:id')
    .get(questionController.getAQuestion)
    .put(auth.questionAccess,
      questionController.editQuestion)
    .delete(auth.questionAccess,
      questionController.deleteQuestion);
};
