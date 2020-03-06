const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
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
  hospital: {
    type: String
  },
  password: {
    type: String
  },
  appointments: [
    {
      date: {
        day: Number,
        month: Number,
        year: Number
      },
      max: {
        type: Number,
        default: 0
      },
      booking: {
        type: Number,
        default: 0
      }
    }
  ]
});

module.exports = Doctor = mongoose.model("doctors", DoctorSchema);
