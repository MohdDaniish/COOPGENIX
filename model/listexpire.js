const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listexpireSchema = new Schema({
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
    ischecked: {
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
    }
});


const listexpire = mongoose.model('listexpire', listexpireSchema);

module.exports = listexpire;
