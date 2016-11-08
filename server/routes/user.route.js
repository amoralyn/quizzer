(() => {
  'use strict';

  const userController = require('./../controllers/user.controller');
  const auth = require('./../middlewares/auth.js');

  module.exports = (router) => {
    //route to login a user
    router.route('/users/login')
      .post(userController.login);

    //route to create a new user
    router.route('/users')
      .post(userController.createNewUser);


    router.use(auth.middleware);
    //route to get all available users
    router.route('/users')
      .get(userController.getAllUsers);

    //route to get, edit and delete a user specified by its Id
    router.route('/users/:id')
      .get(userController.getUserById)
      .put(userController.editUser)
      .delete(userController.deleteUser);
  };


})();
