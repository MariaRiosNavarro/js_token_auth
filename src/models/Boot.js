import mongoose from "mongoose";

const bootSchema = new mongoose.Schema({
  name: String,
  preis: Number,
  besitzer: String,
  ownerId: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const Boot = mongoose.model("Boot", bootSchema, "boote");
