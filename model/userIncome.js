const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserIncomeSchema = new Schema({
  sender: {
    type: String,
    required: true, 

  },
  receiver: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  packageId: {
    type: Number,
    required: true
  },
  poolId: {
    type: Number,
    required: true
  },
  reinvestCount: {
    type: Number,
    default : 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  txHash: { type: String, required: true, },
  block: { type: Number, required: true },
  timestamp: { type: Number, required: true },
});

UserIncomeSchema.index(
  { sender: 1, receiver: 1, amount: 1, packageId: 1, poolId :1, reinvestCount : 1, txHash: 1 },
  { unique: true }
);

const UserIncome = mongoose.model('UserIncome', UserIncomeSchema);

module.exports = UserIncome;
