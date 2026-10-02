import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    placeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    website: {
      type: String, 
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    googleMapsUrl: {
      type: String,
    },

    industry: {
      type: String,
      default: "Home Decor",
    },

    country: {
      type: String,
      default: "United States",
    },

    source: {
      type: String,
      default: "Google Places",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Buyer",
  buyerSchema
);