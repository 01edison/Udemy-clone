const { verify } = require("jsonwebtoken");
const Tokens = require("csrf");
const User = require("../models/user");

const isUserAuthenticated = (req, res, next) => {
  const { headers } = req;
  const token = headers.cookie?.split("=")[1];
  try {
    const user = verify(token, process.env.JWT_SECRET);
    req.profile = user;
    next();
  } catch (err) {
    return res.status(401).json({ err: "Token Expired." });
  }
};

const isCsrfValid = (req, res, next) => {
  const { headers } = req;
  const csrf = headers["x-csrf-token"];
  const tokens = new Tokens();
  const valid = tokens.verify(process.env.JWT_SECRET, csrf);

  if (valid) {
    next();
  } else {
    return res.status(401).send("Malicious Request");
  }
};

const isUserAnInstructor = async (req, res, next) => {
  const { id } = req.profile;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ err: "User doesnt exist" });
    if (user.role.includes("Instructor")) {
      next();
    } else {
      return res.status(400).json({ err: "User is not an instructor" });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};
module.exports = { isUserAuthenticated, isCsrfValid, isUserAnInstructor };
