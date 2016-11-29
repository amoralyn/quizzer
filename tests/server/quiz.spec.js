(() => {
  'use strict';

  const expect = require('expect.js');
  const app = require('./../../server.js');
  const request = require('supertest');
  const faker = require('faker');
  const jwt = require('jsonwebtoken');
  const config = require('./../../server/config/environment');
  const Quiz = require('./../../server/models/quiz.model.js');
  const User = require('./../../server/models/user.model.js');

  describe('Quizzes', () => {
    let jwtToken;
    let owner;
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
           done(err);
          }
          user = res.body.user;
          owner = user._id;
          jwtToken = jwt.sign({ id: owner }, config.secretKey, {
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
      Quiz.remove({}).exec(() => {
        User.remove({}).exec((err) => {
          if (err) {
            console.log(err);
            done();
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
              done(err);
            }
            expect(res.status).to.be(200);
            expect(res.body).to.be.an('object');
            expect(res.body.name).to.eql(quiz.name);
            expect(res.body.description).to.be.a('string');
            done();
          });
      });

      it('Should not create a quiz without a name', (done) => {
        request(app)
          .post('/api/quiz')
          .set('x-access-token', jwtToken)
          .send({description: 'Some content'})
          .end((err, res) => {
            if (err) {
              done(err);
            }
            const expectedError = 'Quiz name is required';
            const error = res.body.errors.name.message;

            expect(res.body).to.be.an('object');
            expect(res.status).to.be(500);
            expect(error).to.eql(expectedError);
            expect(error).to.be.a('string');
            done();
          });
      });

      it('Should not create a quiz without a description', (done) => {
        request(app)
          .post('/api/quiz')
          .set('x-access-token', jwtToken)
          .send({name: faker.lorem.sentence()})
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            const expectedError = 'Description is required';
            const error = res.body.errors.description.message;

            expect(res.body).to.be.an('object');
            expect(res.status).to.be(500);
            expect(error).to.eql(expectedError);
            expect(error).to.be.a('string');
            done();
          });
      });

      it('Should not create quiz for an unathenticated user', (done) => {
        request(app)
          .post('/api/quiz')
          .send(quiz)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.eql('No token provided');
            expect(res.body.message).to.be.a('string');
            expect(res.status).to.be(403);
            done();
          });
      }),

      it('Should create unique quizzes', (done) => {
        request(app)
          .post('/api/quiz')
          .set('x-access-token', jwtToken)
          .send(quiz)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errmsg');
            done();
          });
      });
    });

    describe('Perform CRUD operations', () => {
      let quizId;
      before((done) => {
        const newQuiz = {
          name: faker.lorem.sentence(),
          description: 'Some content'
        };
        request(app)
          .post('/api/quiz/')
          .set('x-access-token', jwtToken)
          .send(newQuiz)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            quizId = res.body._id;
            done();
          });
      });
      console.log(quizId);

      it('Should return all quizzes', (done) => {
        request(app)
          .get('/api/quiz')
          .set('x-access-token', jwtToken)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.be.an('array');
            expect(res.status).to.be(200);
            expect(res.body).not.to.be.empty();
            expect(res.body[0]).to.have.property('name');
            done();
          });
      });

      it('Should get quiz by user', (done) => {
        request(app)
          .get('/api/user/' + owner + '/quizzes')
          .set('x-access-token', jwtToken)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.body).to.be.an('array');
            expect(res.status).to.be(200);
            expect(res.body).not.to.be.empty();
            expect(res.body[0]).to.have.property('name');
            expect(res.body[0]).to.have.property('questions');
            expect(res.body[0]).to.have.property('description');
            expect(res.body[0]).to.have.property('owner');
            expect(res.body).not.to.be.empty();

            done();
          });
      });

      it('Should verify a user is valid', (done) => {
        const id = 23484570943721;
        request(app)
          .get('/api/user/' + id + '/quizzes')
          .set('x-access-token', jwtToken)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).to.be(500);
            expect(res.body).to.be.an('object');
            expect(res.body).not.to.be.empty();
            expect(res.body.message).to.eql('User does not exist');
            done();
          });
      });

      it('Should return quizzes by id', (done) => {
        request(app)
          .get('/api/quiz/' + quizId)
          .set('x-access-token', jwtToken)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).to.be(200);
            expect(res.body).to.be.an('object');
            expect(res.body._id).to.eql(quizId);
            expect(res.body).not.to.be.empty();
            expect(res.body).to.have.property('owner');
            expect(res.body).to.have.property('name');

            done();
          });

        });

      it('should update a quiz', (done) => {
        request(app)
          .put('/api/quiz/' + quizId)
          .set('x-access-token', jwtToken)
          .send({
            name: 'New Quiz file',
            description: 'Updating a document',
          })
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).to.be(200);
            expect(res.body).to.be.an('object');
            expect(res.body).not.to.be.empty();
            expect(res.body.message).to.eql('Quiz successfully updated');
            done();
          });
      });

      it('should not edit quiz without a valid id', (done) => {
       var id = '78236583845893758y8';
       request(app)
         .put('/api/quiz/' + id)
         .set('x-access-token', jwtToken)
         .send({
           title: 'New file',
           content: 'Updating a document',
         })
         .end((err, res) => {
           if (err) {
             done(err);
           }
           expect(res.status).to.be(500);
           expect(res.body).to.be.an('object');
           expect(res.body).not.to.be.empty();


           done();
         });
     });

      it('should verify quiz Id is valid', (done) => {
        var id = '568831c53ff90b4456491b51';
        request(app)
          .get('/api/quiz/' + id)
          .set('x-access-token', jwtToken)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).to.be(404);
            expect(res.body).to.be.an('object');
            expect(res.body).not.to.be.empty();
            expect(res.body.message).to.eql('No quiz found');
            done();
          });
      });

      it('should delete quiz by id', function(done) {
       request(app)
         .delete('/api/quiz/' + quizId)
         .set('x-access-token', jwtToken)
         .end((err, res) => {
           if (err) {
             done(err);
           }
           expect(res.status).to.be(200);
           expect(res.body).not.to.be.empty();
           expect(res.body.message).to.eql('Quiz successfully deleted');
           done();
         });
     });


   });
  });
})();
