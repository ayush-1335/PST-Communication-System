import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  stopName: String,
  latitude: Number,
  longitude: Number
});

const routeSchema = new mongoose.Schema({

  routeName: {
    type: String,
    required: true
  },

  stops: [stopSchema]

}, { timestamps: true });

export const Route = mongoose.model("Route", routeSchema);