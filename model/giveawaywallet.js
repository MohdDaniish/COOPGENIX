const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giveawaySchema = new Schema({
  user: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  polAmt: {
    type: Number,
    required: true
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

const giveawaywallet = mongoose.model('giveawaywallet', giveawaySchema);

module.exports = giveawaywallet;