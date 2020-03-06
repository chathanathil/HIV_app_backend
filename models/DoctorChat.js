const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorChatSchema = new Schema(
  {
    message: {
      type: String
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "doctors"
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "patients"
    }
  },
  { timestamps: true }
);

module.exports = DoctorChat = mongoose.model("doctorChats", DoctorChatSchema);
