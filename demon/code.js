import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "booked", "maintenance"],
      default: "available",
      index: true,
    },

    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      default: null,
    },

    reservedUntil: {
      type: Date,
      default: null,
    },

    version: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

bikeSchema.index({ status: 1 });

export const Bike = mongoose.model("Bike", bikeSchema);