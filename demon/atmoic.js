import mongoose from "mongoose";
import { Bike } from "./models/Bike.js";
import { Reservation } from "./models/Reservation.js";

export async function reserveBike(req, res) {
  const { bikeId } = req.params;
  const { startAt, endAt, idempotencyKey } = req.body;
  const userId = req.user._id;

  if (!idempotencyKey) {
    return res.status(400).json({
      message: "idempotencyKey is required",
    });
  }

  if (new Date(startAt) >= new Date(endAt)) {
    return res.status(400).json({
      message: "Invalid rental dates",
    });
  }

  // Same request retry hui ho to pehle existing booking return karo
  const existingReservation = await Reservation.findOne({
    userId,
    idempotencyKey,
  });

  if (existingReservation) {
    return res.status(200).json({
      message: "Reservation already created",
      reservation: existingReservation,
    });
  }

  const reservationId = new mongoose.Types.ObjectId();
  const holdMinutes = 10;
  const reservedUntil = new Date(Date.now() + holdMinutes * 60 * 1000);

  // ✅ Atomic compare-and-set operation
  const bike = await Bike.findOneAndUpdate(
    {
      _id: bikeId,
      status: "available",
    },
    {
      $set: {
        status: "reserved",
        reservationId,
        reservedUntil,
      },
      $inc: {
        version: 1,
      },
    },
    {
      new: true,
    }
  );

  // Sirf ek concurrent request ko bike milegi
  if (!bike) {
    return res.status(409).json({
      message: "Bike is no longer available",
      code: "BIKE_UNAVAILABLE",
    });
  }

  try {
    const reservation = await Reservation.create({
      _id: reservationId,
      bikeId: bike._id,
      userId,
      startAt,
      endAt,
      status: "payment_pending",
      idempotencyKey,
    });

    return res.status(201).json({
      message: "Bike reserved for 10 minutes. Complete payment to confirm.",
      reservation,
      reservedUntil,
    });
  } catch (error) {
    // Agar reservation create fail hua to bike unlock karni hogi
    await Bike.updateOne(
      {
        _id: bikeId,
        status: "reserved",
        reservationId,
      },
      {
        $set: {
          status: "available",
          reservationId: null,
          reservedUntil: null,
        },
      }
    );

    throw error;
  }
}