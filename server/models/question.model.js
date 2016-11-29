const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const questionSchema = new Schema({
  quizId: {
    type: ObjectId,
    ref: 'Quiz',
  },
  question: {
    type: String,
    required: true,
    unique: [true, 'You have asked this question'],
  },
  options: [{
    type: String,
    required: true,
  }],
  answer: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('Questions', questionSchema);
