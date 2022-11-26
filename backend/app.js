require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { register, login } = require("./controllers/auth");

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

app.get("/", (req, res) => {
  res.send("We're live!!!");
});

app.post("/api/register", register);
app.post("/api/login", login);

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
