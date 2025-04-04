const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const withdrawalSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  netUsdAmt: {
    type: Number,
    required: true
  },
  netPolAmt: {
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

const WithdrawalModel = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = WithdrawalModel;