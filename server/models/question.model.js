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
      }
  });

  module.exports = mongoose.model('Questions', questionSchema);
})();