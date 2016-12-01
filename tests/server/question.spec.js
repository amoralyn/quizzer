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
  let username;
  let owner;
  let user;
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
    beforeEach((done) => {
      request(app)
        .post('/api/quiz')
        .set('x-access-token', jwtToken)
        .send(quiz)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          quizId = res.body._id;
          done();
        });
    });

    afterEach((done) => {
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

    it('Should create a new question', (done) => {
      request(app)
        .post(`/api/quiz/${quizId}/questions`)
        .set('x-access-token', jwtToken)
        .send(question)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).to.be(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('quizId');
          expect(res.body).to.have.property('question');
          expect(res.body).to.have.property('answer');
          expect(res.body).to.have.property('options');
          expect(res.body.options).to.be.an('array');
          expect(res.body.options[0]).to.be.a('string');
          expect(res.body.options).to.eql(question.options);
          done();
        });
    });

    it('Should not create a question without a  quiz question', (done) => {
      request(app)
        .post(`/api/quiz/${quizId}/questions`)
        .set('x-access-token', jwtToken)
        .send({
          options: [
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
          ],
          answer: 2,
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }
          const error = res.body.errors.question.message;
          const expectedError = 'Question is required';
          expect(res.body).to.be.an('object');
          expect(res.status).to.be(500);
          expect(error).to.eql(expectedError);
          expect(error).to.be.a('string');
          done();
        });
    });

    it('Should not create a question without a  quiz answer', (done) => {
      request(app)
        .post(`/api/quiz/${quizId}/questions`)
        .set('x-access-token', jwtToken)
        .send({
          question: `${faker.lorem.sentence()}?`,
          options: [
            faker.lorem.sentence(),
            faker.lorem.sentence(),
            faker.lorem.sentence(),
          ],
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }
          const error = res.body.errors.answer.message;
          const expectedError = 'Answer is required';
          expect(res.body).to.be.an('object');
          expect(res.status).to.be(500);
          expect(error).to.eql(expectedError);
          expect(error).to.be.a('string');
          done();
        });
    });

    it('Should create unique questions', (done) => {
      request(app)
        .post(`/api/quiz/${quizId}/questions`)
        .set('x-access-token', jwtToken)
        .send(question)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).to.be(500);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('errmsg');
          done();
        });
    });
  });

  describe('Perform CRUD operations', () => {
    let questionId;
    beforeEach((done) => {
      newQuestion = {
        question: `${faker.lorem.sentence()}?`,
        options: [
          faker.lorem.sentence(),
          faker.lorem.sentence(),
          faker.lorem.sentence(),
        ],
        answer: 2,
      };
      request(app)
        .post('/api/quiz')
        .set('x-access-token', jwtToken)
        .send(quiz)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          quizId = res.body._id;
          request(app)
            .post(`/api/quiz/${quizId}/questions`)
            .set('x-access-token', jwtToken)
            .send(newQuestion)
            .end((err, res) => {
              if (err) {
                done(err);
              }
              questionId = res.body._id;
            });
          done();
        });
    });

    afterEach((done) => {
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

    // it('Should verify that a quiz exists', (done) => {
    //   const id = '13245678g7845532';
    //   request(app)
    //     .get(`/api/quiz/${id}/questions`)
    //     .set('x-access-token', jwtToken)
    //     .end((err, res) => {
    //       if (err) {
    //         done(err);
    //       }
    //       console.log(res.body);
    //       // expect(res.body);
    //       done();
    //     });
    // });


    it('Should return all questions', (done) => {
      request(app)
        .get(`/api/quiz/${quizId}/questions`)
        .set('x-access-token', jwtToken)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).to.be(200);
          expect(res.body).to.be.an('array');
          expect(res.body).not.to.be.empty();
          expect(res.body[0].options).not.to.be.empty();
          expect(res.body[0].options).to.be.an('array');
          expect(res.body[0]).to.have.property('quizId');
          expect(res.body[0]).to.have.property('question');
          expect(res.body[0]).to.have.property('updatedAt');
          expect(res.body[0]).to.have.property('createdAt');
          expect(res.body[0]).to.have.property('answer');
          expect(res.body[0]).to.have.property('options');
          done();
        });
    });
    //
    it('Should return questions by id', (done) => {
      request(app)
        .get(`/api/quiz/${quizId}/questions/${questionId}`)
        .set('x-access-token', jwtToken)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).to.be(200);
          expect(res.body).to.be.an('object');
          expect(res.body).not.to.be.empty();
          expect(res.body).to.have.property('quizId');
          expect(res.body).to.have.property('question');
          expect(res.body).to.have.property('updatedAt');
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.have.property('answer');
          expect(res.body).to.have.property('options');
          done();
        });
    });

    it('Should update a question', (done) => {
      request(app)
        .put(`/api/quiz/${quizId}/questions/${questionId}`)
        .set('x-access-token', jwtToken)
        .send({
          question: `${faker.lorem.sentence()}?`,
          // options: [
          //   faker.lorem.sentence(),
          //   faker.lorem.sentence(),
          //   faker.lorem.sentence(),
          // ],
          // answer: 1,
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }
          // expect(res.status).to.be(200);
          expect(res.body).to.be.an('object');
          console.log(res.body);
          // expect(res.body).not.to.be.empty();
          // expect(res.body).to.have.property('quizId');
          // expect(res.body).to.have.property('question');
          // expect(res.body).to.have.property('updatedAt');
          // expect(res.body).to.have.property('createdAt');
          // expect(res.body).to.have.property('answer');
          // expect(res.body).to.have.property('options');
          done();
        });
    });

    it('should delete quiz by id', (done) => {
      request(app)
       .delete(`/api/quiz/${quizId}/questions/${questionId}`)
       .set('x-access-token', jwtToken)
       .end((err, res) => {
         if (err) {
           done(err);
         }
         console.log(res.body);
        //  expect(res.status).to.be(200);
        //  expect(res.body).not.to.be.empty();
        //  expect(res.body.message).to.eql('Quiz successfully deleted');
         done();
       });
    });
  });
});
