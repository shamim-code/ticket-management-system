const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    departure: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      default: 50, 
    },
  },
  { timestamps: true }
);

const busModel = mongoose.model('buses', busSchema);

module.exports = busModel;
