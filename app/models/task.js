const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  dueDate: String,
  isComplete: Boolean,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)
