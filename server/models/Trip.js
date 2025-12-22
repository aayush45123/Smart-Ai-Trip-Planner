import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startCity: {
      type: String,
      required: true,
    },

    destinationCity: {
      type: String,
      required: true,
    },

    travelers: {
      type: Number,
      required: true,
      min: 1,
    },

    days: {
      type: Number,
      required: true,
    },

    nights: {
      type: Number,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    stayType: {
      type: String,
      enum: ["hostel", "hotel", "homestay"],
      default: "hostel",
    },

    travelMode: {
      type: String,
      enum: ["road", "train", "mixed"],
      default: "road",
    },

    pace: {
      type: String,
      enum: ["relaxed", "balanced", "fast"],
      default: "balanced",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
