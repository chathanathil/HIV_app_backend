const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  councellor: {
    type: Schema.Types.ObjectId,
    ref: "councellors"
  },
  password: {
    type: String
  },
  deliveryAddress: {
    type: String
  }
});

module.exports = Patient = mongoose.model("patients", PatientSchema);
