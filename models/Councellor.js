const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouncellorSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "admins"
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  password: {
    type: String
  }
});

module.exports = Councellor = mongoose.model("councellors", CouncellorSchema);
