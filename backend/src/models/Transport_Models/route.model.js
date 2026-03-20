import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    stopName: {
      type: String,
      required: true,
      trim: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },

    stops: {
      type: [stopSchema],
      validate: {
        validator: function (stops) {
          const names = stops.map((s) => s.stopName.toLowerCase());
          return new Set(names).size === names.length;
        },
        message: "Duplicate stop names are not allowed in a route"
      }
    }
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);