const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    paystackPublicKey: {
      type: String,
      default: "",
    },
    passwordResetCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = new model("User", userSchema);
module.exports = User;
