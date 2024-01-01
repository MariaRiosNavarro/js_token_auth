import mongoose from "mongoose";
import { hashPassword, genRandomSalt } from "../utils/hash.js";

const userSchema = new mongoose.Schema({
  vorname: String,
  nachname: String,
  email: String,
  password: String,
  passwordSalt: String,
});

// https://mongoosejs.com/docs/middleware.html
// https://mongoosejs.com/docs/api/model.html#Model.create()

// mainSchema.pre('findOneAndUpdate', function() {
//   console.log('Middleware on parent document'); // Will be executed
// });

userSchema.pre("save", function () {
  const passwordSalt = genRandomSalt();
  this.passwordSalt = passwordSalt;
  // this.password = hash(`${this.password}${passwordSalt}`);
  this.password = hashPassword(this.password, passwordSalt);
});

userSchema.virtual("name").get(function () {
  this.vorname + " " + this.nachname;
});

export const User = mongoose.model("User", userSchema, "users");
