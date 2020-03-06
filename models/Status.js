const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  medicine: {
    type: Schema.Types.ObjectId,
    ref: "medicines"
  },
  doctor: {
    type: Boolean,
    default: false
  },
  dispatched: {
    type: Boolean,
    default: false
  },
  picked: {
    type: Boolean,
    default: false
  },
  reache: {
    type: Boolean,
    default: false
  }
});

module.exports = Status = mongoose.model("statuses", StatusSchema);
