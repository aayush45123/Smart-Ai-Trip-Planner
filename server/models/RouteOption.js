import mongoose from "mongoose";

const routeOptionSchema = new mongoose.Schema({
  tripId: mongoose.Schema.Types.ObjectId,
  from: String,
  to: String,
  transportType: String, // train | bus
  durationHours: Number,
  cost: Number,
});

export default mongoose.model("RouteOption", routeOptionSchema);
