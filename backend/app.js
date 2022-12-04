require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Tokens = require("csrf");
const cors = require("cors");
const { isUserAuthenticated, isCsrfValid } = require("./middlewares");
const {
  register,
  login,
  logout,
  sendTestEmail,
  forgotPassword,
  resetPassword,
} = require("./controllers/auth");

const { getUser, becomeInstructor } = require("./controllers/user");

mongoose
  .connect("mongodb://localhost:27017/udemyCloneDB")
  .then(() => console.log("DB Connection Established!"))
  .catch((e) => console.log(e));

const app = express();

//middlewares

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.get("/api", (req, res) => {
  res.send("We're live!!!");
});

// auth routes
app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/logout", logout);
app.get("/api/send-email", sendTestEmail);
app.post("/api/forgot-password", forgotPassword);
app.post("/api/reset-password", resetPassword);

// user routes
app.get("/api/user", isUserAuthenticated, getUser);
app.post("/api/become-instructor", isUserAuthenticated, becomeInstructor)

//csrf token
app.get("/api/csrf-token", (req, res) => {
  const tokens = new Tokens();

  const csrfToken = tokens.create(process.env.JWT_SECRET);

  return res.json({ csrfToken });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
