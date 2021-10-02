const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  city: {
    type: String,
    index: true,
    required: true,
  },
  loc: [{
    type: Number,
    index: true,
  }],
  pop: {
    type: Number,
    index: true,
  },
  state: {
    type: String,
    index: true,
  },
}, {
  timestamps: false,
});

module.exports = mongoose.model('Location', schema);
