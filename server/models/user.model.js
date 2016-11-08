(() => {
  'use strict';
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const bcrypt = require('bcrypt');
  const saltFactor = require('./../config/environment.js').saltFactor;

  let userSchema = new Schema({
    name: {
      firstName: {
        type: String,
        required: false,
        validate: {
          validator: (firstName) => {
            return /[A-Za-z]/.test(firstName);
          },
          message: '{VALUE} is not a valid firstName'
        }
      },
      lastName: {
        type: String,
        required: false,
        validate: {
          validator: (lastName) => {
            return /[A-Za-z]/.test(lastName);
          },
          message: '{VALUE} is not a valid lastName'
        }
      }
    },
    username: {
      type: String,
      required: true,
      unique: [true, 'username already taken'],
      validate: {
        validator: (username) => {
          return /\w+/.test(username);
        },
        message: '{VALUE} is not a valid username'
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required for account registration'],
      unique: [true, 'Email already in use'],
      validate: {
        validator: (email) => {
          return /\S+@\S+\.\S+/.test(email);
        },
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required for account registration'],
      validate: {
        validator: (password) => {
          return /\w+/.test(password);
        },
        message: '{VALUE} is not a valid password'
      }
    }
  });

  userSchema.pre('save', function(next) {
    let user = this;

    // get the current date
    var currentDate = new Date();

    // change the updatedAt field to current date
    this.updatedAt = currentDate;

    // if createdAt doesn't exist, add to that field
    if (!this.createdAt) {
      this.createdAtt = currentDate;
      next();
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }

    // generate a salt
    bcrypt.genSalt(Number(saltFactor), (err, salt) => {
      if (err) {
        return next(err);
      }

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

  userSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };


  module.exports = mongoose.model('User', userSchema);
})();
