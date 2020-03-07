const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO:Add paharmacy

const MedicineSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "doctors"
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "patients"
  },
  pharmacy: {
    type: Schema.Types.ObjectId,
    ref: "pharmacies"
  },
  date: {
    type: Date
  },
  dispatched: {
    type: Boolean,
    default: false
  },
  key: {
    type: String
  },
  medicines: {
    type: String
  }
});

module.exports = Medicine = mongoose.model("medicines", MedicineSchema);
