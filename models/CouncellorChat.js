const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouncellorChatSchema = new Schema(
  {
    message: {
      type: String
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "councellors"
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "patients"
    }
  },
  { timestamps: true }
);

module.exports = CouncellorChat = mongoose.model(
  "councellorChats",
  CouncellorChatSchema
);
