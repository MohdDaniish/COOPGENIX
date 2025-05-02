const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weeklyfundSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default:0
    },
    polAmt: {
        type: Number,
        default:0
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

weeklyfundSchema.index(
    { user: 1, amount: 1, txHash: 1 },
    { unique: true }
  );

const weeklyfund = mongoose.model('weeklyfund', weeklyfundSchema);

module.exports = weeklyfund;
