import mongoose from "mongoose";

const bootSchema = new mongoose.Schema({
  name: String,
  preis: Number,
  besitzer: String,
});

export const Boot = mongoose.model("Boot", bootSchema, "boote");
