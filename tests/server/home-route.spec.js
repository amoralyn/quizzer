(() => {
  'use strict';

  const request = require('supertest');
  const expect = require('expect.js');
  const app = require('./../../server.js');

  describe('Test for the home route', () => {
    context('When there is a request for the home route', () => {
      it('Should return expected response', (done) => {
        request(app)
          .get('/*')
          .end((err, res) => {
            if (err) {
              throw err;
            }
            expect(res.body).to.be.an('object');
            done();
          });
      });
    });
  });

})();
