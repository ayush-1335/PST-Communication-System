import cron from "node-cron";
import { StudentTransport } from "../models/Transport_Models/studentTransport.model.js";

cron.schedule("0 * * * *", async () => { // every hour

  try {

    const now = new Date();

    const expired = await StudentTransport.updateMany(
      {
        status: "APPROVED",
        expiresAt: { $lt: now }
      },
      {
        $set: { status: "EXPIRED" }
      }
    );

    console.log("Expired Requests:", expired.modifiedCount);

  } catch (error) {
    console.log("Cron Error:", error);
  }

});