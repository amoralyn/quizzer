(() =>{
  'use strict';
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  let quizSchema = new Schema({
    userId: {
      type: ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Quiz name is required'],
      unique: [true, 'A quiz with this name already exists'],
    },
    description: {
      type: String,
      required: [true,'Description is required']
    },
    questions: [{
      type: ObjectId,
      ref: 'Questions'
    }]
  });

  module.exports = mongoose.model('Quiz', quizSchema);
})();