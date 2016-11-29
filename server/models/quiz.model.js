const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const quizSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Quiz name is required'],
    unique: [true, 'A quiz with this name already exists'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  questions: [{
    type: ObjectId,
    ref: 'Questions',
  }],
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

module.exports = mongoose.model('Quiz', quizSchema);
