require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const formidableMiddleware = require("express-formidable");
const Tokens = require("csrf");
const cors = require("cors");
const {
  isUserAuthenticated,
  isCsrfValid,
  isUserAnInstructor,
} = require("./middlewares");

const {
  register,
  login,
  logout,
  sendTestEmail,
  forgotPassword,
  resetPassword,
} = require("./controllers/auth");

const { getUser, becomeInstructor } = require("./controllers/user");
const {
  courses,
  uploadImage,
  uploadVideo,
  deleteVideo,
  deleteImage,
  createCourse,
  updateCourse,
  getCourses,
  getCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  publishCourse,
  unpublishCourse,
  checkEnrollment,
  enroll
} = require("./controllers/course");

mongoose
  .connect("mongodb://localhost:27017/udemyCloneDB")
  .then(() => console.log("DB Connection Established!"))
  .catch((e) => console.log(e));

const app = express();

//middlewares

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const instructorRoute = [isUserAuthenticated, isUserAnInstructor];

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
app.post("/api/become-instructor", isUserAuthenticated, becomeInstructor);

//course routes
app.get("/api/live-courses", courses)
app.post("/api/course/upload-image", instructorRoute, uploadImage);
app.post(
  "/api/course/upload-video/:instructorId",
  instructorRoute,
  formidableMiddleware(),
  uploadVideo
);
app.post("/api/course/delete-video/:slug", instructorRoute, deleteVideo);
app.post("/api/course/delete-image", instructorRoute, deleteImage);
app.post("/api/course", instructorRoute, createCourse);
app.patch("/api/course", instructorRoute, updateCourse)
app.get("/api/courses", instructorRoute, getCourses);
app.get("/api/course/:slug", getCourse);
app.patch("/api/course/publish/:courseId", instructorRoute, publishCourse);
app.patch("/api/course/unpublish/:courseId", instructorRoute, unpublishCourse);
app.get("/api/check-enrollment/:courseId", isUserAuthenticated, checkEnrollment)
app.post("/api/course-enrollment/:courseId", isUserAuthenticated, enroll)

//lesson routes
app.delete("/api/course/delete-lesson/:slug/:lessonTitle", instructorRoute, deleteLesson)
app.post("/api/course/add-lesson/:slug/:instructorId", instructorRoute, addLesson);
app.put("/api/course/update-lesson/:slug/:instructorId", instructorRoute, updateLesson)

//csrf token
app.get("/api/csrf-token", (req, res) => {
  const tokens = new Tokens();

  const csrfToken = tokens.create(process.env.JWT_SECRET);

  return res.json({ csrfToken });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
