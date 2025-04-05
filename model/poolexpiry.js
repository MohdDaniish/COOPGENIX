const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const poolexpirySchema = new Schema({
    user: {
        type: String,
        required: true
    },
    packageId: {
        type: Number,
        default:0
    },
    expiry: {
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

poolexpirySchema.index(
    { user: 1, packageId: 1,expiry:1, txHash: 1 },
    { unique: true }
  );

const poolexpiry = mongoose.model('poolexpiry', poolexpirySchema);

module.exports = poolexpiry;
