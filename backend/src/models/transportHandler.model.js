import mongoose from "mongoose";

const transportHandlerSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  }

}, { timestamps: true });

export const TransportHandler = mongoose.model("TransportHandler", transportHandlerSchema);