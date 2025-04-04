const mongoose = require("mongoose");
const registration = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: { unique: true },
    },
    user: { type: String, required: true, unique: true },
    referrerId: { type: String, required: true,trim:true },
    referrer: { type: String, required: true },
    uId: { type: Number, default: 0},
    rId: { type: Number, default: 0},
    rank: { type: Number, default: 0 },
    directCount: { type: Number, default: 0 },
     invest_amount: { type: Number,default : 0 },
     rank: { type: String, default : null },
     ranknumber: { type: Number,default : 0 },
     slot_rank: { type: String, default : null },
     slot_ranknumber: { type: Number,default : 0 },
    txHash: { type: String, required: true, unique: true },
    block: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    cal_status:{type:Number,default:0},
    teamBusinessnew:{type:Number, default:0}
  },
  { timestamps: true, collection: "registration" }
);

module.exports = mongoose.model("registration", registration);