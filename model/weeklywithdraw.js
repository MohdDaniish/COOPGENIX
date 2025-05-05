const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawweeklySchema = new Schema({
  user: {
    type: String,
    required: true
  },
  weeklyReward: {
    type: Number,
    required: true
  },
  polAmt: {
    type: Number,
    required: true
  },
  nonce: {
    type: Number,
    default: 0
  },
  trxnHash : {
    type: String,
    default : null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  timestamp:{
    type: Date,
    default: Date.now
  }
});

const weeklywithdraw = mongoose.model('weeklywithdraw', withdrawweeklySchema);

module.exports = weeklywithdraw;