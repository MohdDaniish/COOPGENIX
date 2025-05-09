const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reEntrySchema = new Schema({
    user: {
        type: String,
        required: true
    },
    packageId: {
        type: Number,
        default:0
    },
    reinvest: {
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
    txHash: { type: String, required: true, },
    block: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

reEntrySchema.index(
    { user: 1, packageId: 1, reinvest : 1, level :1, txHash: 1 },
    { unique: true }
  );

const reEntry = mongoose.model('reentri', reEntrySchema);

module.exports = reEntry;
