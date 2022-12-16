const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ShortUniqueId = require("short-unique-id");
const { hashPassword, comparePassword } = require("../utils/auth");
const { sesClient } = require("../utils/sesClient");
const { createSendEmailCommand } = require("../utils/ses_sendEmail");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    User.findOne({ email }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          return res.status(400).json({ err: "User already exists" });
        }
        User.create(
          {
            name,
            email,
            password: hashedPassword,
          },
          (err, result) => {
            if (!err) {
              return res.status(200).json({ msg: "User created successfully" });
            } else {
              return res.status(400).json({ err });
            }
          }
        );
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)
      return res.status(400).json({ err: "Please provide your email" });
    User.findOne({ email }, (err, foundUser) => {
      if (!err) {
        if (!foundUser) {
          return res.status(400).json({ err: "User doesn't exist" });
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
  } catch (e) {
    console.log(e);
  }
};

const logout = (req, res) => {
  res.clearCookie("token");

  return res.json({ msg: "Logout successful" });
};

const sendTestEmail = async (req, res) => {
  const sendEmailCommand = createSendEmailCommand(
    process.env.EMAIL,
    process.env.EMAIL,
    "acwewjnecwriw"
  );
  try {
    await sesClient.send(sendEmailCommand);
    return res.json({ ok: true });
  } catch (e) {
    console.error("Failed to send email.");
    return res.json({ err: e });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const uid = new ShortUniqueId({ length: 6 });
    const shortCode = uid();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.json({ err: "User Doesn't Exist" });

    const sendEmailCommand = createSendEmailCommand(
      process.env.EMAIL,
      process.env.EMAIL,
      shortCode
    );
    try {
      await sesClient.send(sendEmailCommand);
      return res.json({ ok: true });
    } catch (e) {
      console.error("Failed to send email.");
      return res.json({ err: e });
    }
  } catch (e) {
    console.log(e);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const _newPassword = await hashPassword(newPassword);
    const user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: _newPassword, passwordResetCode: "" }
    );
    if (!user) return res.status(400).json({ err: "invalid code" });
    else {
      return res.json({ msg: "Password reset successfully!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err });
  }
};

module.exports = {
  register,
  login,
  logout,
  sendTestEmail,
  forgotPassword,
  resetPassword,
};
