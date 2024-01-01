import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  vorname: String,
  nachname: String,
  email: String,
  password: String,
});

userSchema.virtual("name").get(function () {
  this.vorname + " " + this.nachname;
});

export const User = mongoose.model("User", userSchema, "users");
