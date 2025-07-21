const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true, // 🔥 passport-local-mongoose needs this!
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    minlength: [10, "Phone number must be at least 10 digits"],
    maxlength: [12, "Phone number must be at most 12 digits"],
    match: [/^\d+$/, "Phone number must contain only digits"],
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
