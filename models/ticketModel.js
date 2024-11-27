const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'buses',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    timeSlot: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('tickets', ticketSchema);
