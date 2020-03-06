const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  councellor: {
    type: Schema.Types.ObjectId,
    ref: "councellors"
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "doctors"
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "patients"
  },
  date: {
    type: Date
  },
  subject: {
    type: String
  },
  description: {
    type: String
  },
  result: {
    type: String
  }
});

module.exports = Result = mongoose.model("results", ResultSchema);
