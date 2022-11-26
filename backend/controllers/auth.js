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

const login = async (req, res)=>{
  
}
module.exports = { register, login };
