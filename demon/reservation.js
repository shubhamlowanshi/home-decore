const reservationSchema = new mongoose.Schema(
  {
    bikeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["payment_pending", "confirmed", "cancelled", "expired"],
      default: "payment_pending",
      index: true,
    },

    paymentId: {
      type: String,
      default: null,
    },

    idempotencyKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Same request retry hone par duplicate booking na bane
reservationSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true }
);

export const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);