(() => {
  'use strict';

  const expect = require('expect.js');
  const app = require('./../../server.js');
  const request = require('supertest');
  const faker = require('faker');
  const jwt = require('jsonwebtoken');
  const config = require('./../../server/config/environment');

  describe('Quizzes', () => {
    let jwtToken;
    let userId;
    let quiz;
    let user;
    let credentials = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    before(done => {
      request(app)
        .post('/api/users')
        .send(credentials)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          user = res.body.user;
          userId = user._id;
          jwtToken = jwt.sign({ id: userId }, config.secretKey, {
            expiresIn: 60 * 60 * 24
          });
          quiz = {
            name: faker.lorem.sentence(),
            description: 'Some content',
          };
          done();
        });
    });

    after(done => {
      quiz.remove({}).exec(() => {
        user.remove({}).exec((err) => {
          if (err) {
            console.log(err);
          }
          done();
        })
      })
    });

    describe('Creating Quiz', () => {
      it('Should create a new quiz', (done) => {
        request(app)
          .post('/api/quiz')
          .set('x-access-token', jwtToken)
          .send(quiz)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.status).to.be(200);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.eql(quiz.name);
            expect(res.body.description).to.be.a('string');
            done();
          });
      });

      it('Should not create a quiz without a title', (done) => {
        request(app)
          .post('/api/quiz')
          .set('x-access-token', jwtToken)
          .send({description: 'Some content'})
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            console.log(res.body);
            expect(res.body).to.be.an('object');
            expect(res.status).to.be(500);
            done();
          });
      });
    });
  });
})();