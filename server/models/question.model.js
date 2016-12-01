const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const notEmpty = (options) => {
  if (options.length === 0 || options.length < 3) {
    return false;
  }
  return true;
};

const questionSchema = new Schema({
  quizId: {
    type: ObjectId,
    ref: 'Quiz',
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    unique: [true, 'You have asked this question'],
  },
  options: [{
    type: [String],
    required: [true, 'Options are required'],
    validate: [notEmpty, 'Please add at least one feature in the options array'],
  }],
  answer: {
    type: Number,
    required: [true, 'Answer is required'],
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
