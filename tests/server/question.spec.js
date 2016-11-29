const expect = require('expect.js');
const app = require('./../../server.js');
const request = require('supertest');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const config = require('./../../server/config/environment');
const Quiz = require('./../../server/models/quiz.model.js');
const User = require('./../../server/models/user.model.js');
const Question = require('./../../server/models/question.model.js');

describe('Questions', () => {
  let jwtToken;
  let quizId;
  const credentials = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const quiz = {
    name: faker.lorem.sentence(),
    description: faker.lorem.sentences(),
  };
  const question = {
    question: `${faker.lorem.sentence()}?`,
    options: [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
    ],
    answer: 2,
  };

  before((done) => {
    request(app)
      .post('/api/users')
      .send(credentials)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        user = res.body.user;
        owner = user._id;
        username = user.username;
        jwtToken = jwt.sign({ id: owner }, config.secretKey, {
          expiresIn: 60 * 60 * 24,
        });
        done();
        request(app)
          .post('/api/quiz')
          .set('x-access-token', jwtToken)
          .send(quiz)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            quizId = res.body._id;
            console.log(res.body._id, jwtToken, 'here');
          });
        console.log(quizId, quizId);
      });
  });

  after((done) => {
    Question.remove({}).exec(() => {
      Quiz.remove({}).exec(() => {
        User.remove({}).exec((err) => {
          if (err) {
            console.log(err);
            done();
          }
          done();
        });
      });
    });
  });

  describe('Creating Questions', () => {
    console.log(quizId, 'here');
    it('Should create a new question', (done) => {
      request(app)
        .post(`/api/quiz/${quizId}/questions`)
        .set('x-access-token', jwtToken)
        .send(question)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          // console.log(res.body);
          done();
        });
    });
  });
});
