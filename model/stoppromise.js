const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stoppromiseSchema = new Schema({
    user: {
        type: String,
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
    txHash: { type: String, required: true, },
    block: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});


const stoppromise = mongoose.model('stoppromise', stoppromiseSchema);

module.exports = stoppromise;
