(() => {
  'use strict';
  require('dotenv').load();

  module.exports = {
    database: process.env.DATABASE_URL,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    saltFactor: process.env.SALT_FACTOR
  }

})();
