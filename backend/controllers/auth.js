const jwt = require("jsonwebtoken");
const Tokens = require("csrf");
const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/auth");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  User.findOne({ email }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        return res.status(400).json({ err: "User already exists" });
      }
      User.create({ name, email, password: hashedPassword }, (err, result) => {
        if (!err) {
          return res.status(200).json({ msg: "User created successfully" });
        } else {
          return res.status(400).json({ err });
        }
      });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ err: "Please provide your email" });
  User.findOne({ email }, (err, foundUser) => {
    if (!err) {
      if (!foundUser) {
        return res.json({ err: "User doesn't exist" });
      } else {
        const match = comparePassword(password, foundUser.password);
        if (match) {
          //generate jwt token
          const token = jwt.sign(
            { id: foundUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          foundUser.password = undefined; // so the user's password isnt sent to client ;)

          res.cookie("token", token, {
            httpOnly: true,
          });     
          return res.json({ user: foundUser });
        } else {
          return res.status(400).json({ err: "Password Incorrect" });
        }
      }
    } else {
      return res.status(400).json({ err });
    }
  });
};

const logout = (req, res) => {
  res.clearCookie("token");

  return res.json({ msg: "Logout successful" });
};

module.exports = { register, login, logout };
