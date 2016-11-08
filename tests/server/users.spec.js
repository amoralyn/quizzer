(() => {
  'use strict';

  const expect = require('expect.js');
  const app = require('./../../server.js');
  const request = require('supertest');
  const faker = require('faker');

  let userCredentials = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  describe('SignUp', () => {
    context('When the user signs up with valid credentials ', () => {

      it('Should create a new user successfully', (done) => {
        request(app)
          .post('/api/users')
          .send(userCredentials)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.be.an('object');
            expect(res.body.user.username).to.eql(userCredentials.username);
            expect(res.body).to.not.be.empty();
            done();
          });
      });
    });

    context('When the user enters an invalid email address', () => {
      let userInfo = {
        username: faker.internet.userName(),
        email: 'tlovelyn@yahoo',
        password: faker.internet.password()
      };

      it('Should reject the registration for invalid email', (done) => {
        request(app)
          .post('/api/users')
          .send(userInfo)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            let expectedError = 'tlovelyn@yahoo is not a valid email';

            let error = res.body.errors.email.message;

            expect(res.body).to.be.an('object');
            expect(error).to.eql(expectedError);
            expect(error).to.be.a('string');
            expect(error).not.to.be.empty();
            done();
          });

      });
    });

    context('When the user does not enter an email address or password', () => {
      it('Should reject registration for missing email', (done) => {
        request(app)
          .post('/api/users')
          .send({ username: faker.internet.userName(),
             password: faker.internet.password() })
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            let expectedError = 'Email is required for account registration';


            let error = res.body.errors.email.message;
            expect(error).to.eql(expectedError);
            expect(res.body).to.be.an('object');
            expect(error).to.be.a('string');
            expect(error).not.to.be.empty();
            done();

          });
      });

      it('Should reject the registration for missing password', (done) => {
        request(app)
          .post('/api/users')
          .send({ email: faker.internet.email(),
             username: faker.internet.userName() })
          .end((err, res) => {

            if (err) {
              return done(err);
            }

            let expectedError = 'Password is required for account registration';

            let error = res.body.errors.password.message;

            expect(res.body).to.be.an('object');
            expect(error).to.be.an('string');
            expect(error).not.to.be.empty();
            expect(error).to.eql(expectedError);
            done();
          });
      });
    });

    context('When the user signs up with an existing username', () => {
      it('Should reject registration for already existing username', (done) => {
        request(app)
          .post('/api/users')
          .send(userCredentials)
          .end((err, res) => {
            console.log(res.body);
            done();
          });
      });
    });
  });

  describe('Login', () => {
    context('When the user logs in with valid credentials', () => {
      it('Should login the user successfully', (done) => {
        request(app)
          .post('/api/users/login')
          .send(userCredentials)
          .end((err, res) => {
            let data = res.body;
            expect(data).to.be.an('object');
            expect(data.user.email).to.equal(userCredentials.email);
            expect(data).to.have.key('token');
            expect(data.token).to.be.a('string');
            done();
          });
      });
    });

    context('When the user logs in with invalid credentials', () => {
      it('Should stop the user from being logged in', (done) => {
        let invalidCredentials = {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password()
        };
        request(app)
          .post('/api/users/login')
          .send(invalidCredentials)
          .end((err, res) => {
            let error = res.body;
            let expectedError = 'Authentication failed, User not found';
            expect(error.message).to.eql(expectedError);
            expect(error.message).to.be.a('string');
            expect(error).to.be.an('object');
            done();
          });
      });
    });

  });

})();
