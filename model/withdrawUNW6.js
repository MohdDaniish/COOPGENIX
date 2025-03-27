const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WithdrawUNW6Schema = new Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    txHash: { type: String, required: true,},
    block: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

const WithdrawUNW6 = mongoose.model('WithdrawUNW6', WithdrawUNW6Schema);

module.exports = WithdrawUNW6;
