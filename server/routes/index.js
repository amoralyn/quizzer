(() => {
  'use strict';

  const userRoutes = require('./user.route');

  module.exports = (router) => {
    userRoutes(router);
  };

})();
