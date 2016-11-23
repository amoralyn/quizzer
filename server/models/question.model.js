(() => {
  'use strict';
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  let questionSchema = new Schema({
      quizId: {
        type: ObjectId,
        ref: 'Quiz'
      },
      question: {
        type: String,
        required: true,
        unique: [true, 'You have asked this question']
      },
      answers: [{
        type: String,
        required: true
      }],
      correctIndex:{
        type: Number,
        required: true
      },
      createdAt: {
       type: Date,
       default: Date.now,
       required: true
     },
     updatedAt: {
       type: Date,
       default: Date.now,
       required: true
     }
  });

  module.exports = mongoose.model('Questions', questionSchema);
})();