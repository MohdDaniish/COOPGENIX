const mongoose = require("mongoose");
const { Schema } = mongoose;

const globalrewardSchema = new Schema(
  {
      user: { type:  String,required: true },
      amount: { type:  Number,required: true },
      polAmt: { type:  Number,required: true },
      directs: { type:  Number,required: true },
      weeklyfund: { type:  Number,required: true },
      shareratio: { type:  Number,required: true },
      datefrom: { type:  Date,required: true },
      dateto: { type:  Date,required: true },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }
  }
);

// Create indexes for unique fields
// userSchema.index({ mobileNumber: 1, 'documents.pan.number': 1 });
const globalreward = mongoose.model("globalreward", globalrewardSchema);

module.exports = globalreward;