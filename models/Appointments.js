const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "doctors"
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "patients"
  },
  date: {
    type: String
  }
});

module.exports = Appointment = mongoose.model(
  "appointments",
  AppointmentSchema
);
