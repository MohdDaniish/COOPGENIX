const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const growthSchema = new Schema({
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

const growthwallet = mongoose.model('growthwallet', growthSchema);

module.exports = growthwallet;