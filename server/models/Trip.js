import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startCity: String,
    days: Number,
    budget: Number,
    groupSize: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
