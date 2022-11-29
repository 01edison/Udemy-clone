const { verify } = require("jsonwebtoken");
const Tokens = require("csrf");

const isUserAuthenticated = (req, res, next) => {
  const { headers } = req;
  const token = headers.cookie?.split("=")[1];
  try {
    const user = verify(token, process.env.JWT_SECRET);
    req.profile = user;
    next();
  } catch (e) {
    console.log("sorry, token expired", e);
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
module.exports = { isUserAuthenticated, isCsrfValid };
