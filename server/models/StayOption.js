import mongoose from "mongoose";

const stayOptionSchema = new mongoose.Schema({
  city: String,
  type: String, // hostel | budget hotel
  costPerNight: Number,
});

export default mongoose.model("StayOption", stayOptionSchema);
