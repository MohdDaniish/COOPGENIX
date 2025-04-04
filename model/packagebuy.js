const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packagebuySchema = new Schema({
    user: {
        type: String,
        required: true
    },
    packageId: {
        type: Number,
        required: true
    },
    usdAmt: {
        type: Number,
        default : 0
    },
    polAmt: {
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
    txHash: { type: String, required: true,},
    block: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

packagebuySchema.index(
    { user: 1, packageId : 1,usdAmt :1, polAmt : 1, txHash: 1 },
    { unique: true }
  );

const packagebuy = mongoose.model('packagebuy', packagebuySchema);

module.exports = packagebuy;
