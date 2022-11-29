require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Tokens = require("csrf");
const cors = require("cors");
const { isUserAuthenticated, isCsrfValid } = require("./middlewares");
const { register, login, logout } = require("./controllers/auth");
const { getUser } = require("./controllers/user");

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

// user routes
app.get("/api/user", isUserAuthenticated, getUser);

app.get("/api/csrf-token", (req, res) => {
  const tokens = new Tokens();

  const csrfToken = tokens.create(process.env.JWT_SECRET);

  return res.json({ csrfToken });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
