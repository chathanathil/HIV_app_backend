const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuidlinesSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "admins"
  },
  subject: {
    type: String
  },
  text: {
    type: String
  },
  image: {
    type: String
  }
});

module.exports = Guidlines = mongoose.model("guidlines", GuidlinesSchema);
