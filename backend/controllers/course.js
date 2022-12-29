const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../utils/s3Client");
const ShortUniqueId = require("short-unique-id");
const Course = require("../models/course");
const User = require("../models/user");
const slugify = require("slugify");
const fs = require("fs");

const uploadImage = async (req, res) => {
  const { imageUri } = req.body;
  if (!imageUri) return res.status(400).json({ err: "No Image provided" });

  const base64Data = new Buffer.from(
    imageUri.replace(/^data:image\/\w+;base64/, ""),
    "base64"
  ); //to get rid of the string that comes before the actual base 64 data

  const uid = new ShortUniqueId({ length: 6 });
  const type = imageUri.split(";")[0].split("/")[1]; //eg jpeg

  const imageParams = {
    Bucket: process.env.BUCKET,
    Key: `${uid()}.${type}`,
    Body: base64Data,
    ContentType: `image/${type}`, // very important
    ContentEncoding: "base64",
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(imageParams));
    // console.log({
    //   location: `https://${imageParams.Bucket}.s3.amazonaws.com/${imageParams.Key}`,
    // });
    return res.json({
      location: `https://${imageParams.Bucket}.s3.amazonaws.com/${imageParams.Key}`,
      key: imageParams.Key,
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

const deleteImage = async (req, res) => {
  const { image } = req.body;

  if (!image) return res.status(400).json({ err: "No Image provided" });

  const imageParams = {
    Bucket: process.env.BUCKET,
    Key: image.key,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(imageParams));
    // console.log("Success. Object deleted.", data);
    return res.json({
      msg: `Object with key: ${imageParams.Key} deleted from Bucket successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

const uploadVideo = async (req, res) => {
  try {
    const { video } = req.files;
    const { instructorId } = req.params;

    if (!video) return res.status(400).json({ err: "No video" });
    const uid = new ShortUniqueId({ length: 6 });
    const type = video.type.split("/")[1];

    const videoParams = {
      Bucket: process.env.BUCKET,
      Key: `${uid()}.${type}`,
      Body: fs.readFileSync(video.path),
      ContentType: video.type,
    };

    //upload to S3
    try {
      const data = await s3Client.send(new PutObjectCommand(videoParams));
      console.log({
        location: `https://${videoParams.Bucket}.s3.amazonaws.com/${videoParams.Key}`,
      });
      return res.json({
        location: `https://${videoParams.Bucket}.s3.amazonaws.com/${videoParams.Key}`,
        key: videoParams.Key,
      });
    } catch (e) {
      console.log(e);
      return res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteVideo = async (req, res) => {
  const { slug } = req.params;
  const {
    video: { key },
    lessonTitle,
  } = req.body;

  if (!key)
    return res.status(400).json({ err: "No Key provided for video deletion." });

  const videoParams = {
    Bucket: process.env.BUCKET,
    Key: key,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(videoParams));
    console.log(
      `Object with key: ${videoParams.Key} deleted from Bucket successfully`
    );

    Course.findOne({ slug }, (err, course) => {
      if (!err) {
        if (!course) return res.status(400).json({ err: "No course found" });
        else {
          //find the index of that lesson
          const lessonIndex = course.lessons.findIndex(
            (lesson) => lesson.title == lessonTitle
          );
          //use that index and splice that lesson out and set its video to empty object
          let lesson = course.lessons.splice(lessonIndex, 1)[0];
          //use splice to insert it back into that index
          lesson.video = { location: "", key: "" };
          course.lessons.splice(lessonIndex, 0, lesson);
          // save course
          course.save((err) => {
            if (!err) return res.json({ msg: "Video deleted successfully" });
            else {
              return res.status(400).json({ err });
            }
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err });
  }
};

const createCourse = (req, res) => {
  try {
    const { id: instructorId } = req.profile;
    const { name, description, category, price, paid, image } = req.body;
    Course.findOne({ slug: slugify(name) }, (err, course) => {
      if (!err) {
        if (course) {
          return res.status(400).json({ err: "Course already exists" });
        }
        Course.create(
          {
            slug: slugify(name),
            name,
            instructor: instructorId,
            description,
            category,
            price: paid ? price : 0,
            paid,
            image,
          },
          (err, course) => {
            if (!err) {
              return res
                .status(201)
                .json({ msg: "Course created successfully", course });
            } else {
              console.log(err);
              return res.status(400).json({ err });
            }
          }
        );
      } else {
        return res.status(400).json({ err });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: "Couldn't create course, try again" });
  }
};

const updateCourse = (req, res) => {
  try {
    const { id: instructorId } = req.profile;
    const { name, slug, description, category, price, paid, image } = req.body;

    Course.findOneAndUpdate(
      { instructor: instructorId, slug },
      {
        slug: slugify(name),
        name,
        description,
        category,
        price: paid ? price : 0,
        paid,
        image,
      },
      { new: true },
      (err, result) => {
        if (!err) {
          return res.status(201).json({ result });
        } else {
          return res.status(400).json({ err });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};

const getCourse = (req, res) => {
  try {
    const slug = req.params.slug;
    Course.findOne({ slug })
      .populate("instructor")
      .exec((err, course) => {
        if (!err) {
          if (!course) return res.status(400).json({ err: "Course not found" });
          else {
            return res.send(course);
          }
        }
      });
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

const courses = (req, res) => {
  try {
    Course.find({ published: true })
      .populate("instructor", "_id name")
      .exec((err, courses) => {
        if (!err) {
          if (!courses) return res.status(400).send("No Courses");
          else {
            return res.status(200).send(courses);
          }
        }
      });
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

const getCourses = (req, res) => {
  const { id: instructorId } = req.profile;

  try {
    Course.find({ instructor: instructorId })
      .sort({ createdAt: "desc" })
      .populate("instructor", "name")
      .then((courses) => {
        if (!courses) {
          return res.status(400).json({ err: "No Courses found" });
        }
        return res.send(courses);
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ err: e });
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};

const addLesson = (req, res) => {
  try {
    const { slug, instructorId } = req.params;
    const { lesson } = req.body;

    const _lesson = { ...lesson, slug: slugify(lesson.title) };
    Course.findOne({ slug })
      .populate("instructor")
      .exec((err, course) => {
        if (!err) {
          if (
            course.lessons.some(
              (lesson) =>
                lesson.title == _lesson.title || lesson.slug == _lesson.slug
            )
          ) {
            return res.status(400).json({ err: "Lesson already exists" });
          }
          course.lessons.push(_lesson);
          course.save((err) => {
            if (!err) {
              return res.status(201).send(course);
            } else {
              return res.status(400).json({ err });
            }
          });
        } else {
          console.log(err);
          return res.status(400).json({ err });
        }
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};

const updateLesson = (req, res) => {
  try {
    const { slug, instructorId } = req.params;
    const { currentLesson } = req.body;

    // console.log(currentLesson, slug, instructorId);

    Course.findOne({ slug }, (err, course) => {
      if (!err) {
        if (!course) {
          return res.status(400).json({ err: "No course found" });
        } else {
          const lessonIndex = course.lessons.findIndex(
            (lesson) => lesson.slug === currentLesson.slug
          );
          course.lessons.splice(lessonIndex, 1, currentLesson); //replace the old with the new at the same ind
          course.save((err) => {
            if (!err) return res.status(200).send(course);
            else {
              return res.status(400).json({ err });
            }
          });
        }
      } else {
        console.log(err);
        return res.send(err);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err });
  }
};

const deleteLesson = (req, res) => {
  try {
    const { slug, lessonTitle } = req.params;

    Course.findOne({ slug }, (err, course) => {
      if (err) return res.status(400).json({ err });

      if (course) {
        const filteredLessons = course.lessons.filter(
          (lesson) => lesson.title != lessonTitle
        );
        course.lessons = filteredLessons;

        course.save((err) => {
          if (!err)
            return res.json({ msg: `${lessonTitle} deleted successfully!` });
          else {
            return res.status(400).json({ err });
          }
        });
      } else {
        return res.status(400).json({ err: "Course does not exist" });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};

const publishCourse = (req, res) => {
  try {
    const { courseId } = req.params;
    Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true },
      (err, course) => {
        if (!err) {
          return res.status(201).send(course);
        } else {
          return res.status(400).json({ err });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

const unpublishCourse = (req, res) => {
  try {
    const { courseId } = req.params;
    Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true },
      (err, course) => {
        if (!err) {
          return res.status(201).send(course);
        } else {
          return res.status(400).json({ err });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

const checkEnrollment = (req, res) => {
  try {
    const { courseId } = req.params;
    const { id } = req.profile;

    Course.findOne({ _id: courseId }, (err, course) => {
      if (!err) {
        if (!course) return res.status(400).send("No course found");

        const match = course?.paid_students.some(
          (studentId) => studentId === id
        );
        if (match) {
          return res.status(200).send(true);
        } else {
          return res.send(false);
        }
      } else {
        return res.status(400).send(err);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const enroll = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id } = req.profile;
    const user = await User.findById(id)
    Course.findOne({ _id: courseId }, (err, course) => {
      if (err) return res.status(400).send(err);

      if (!course) return res.status(400).send("No Course found");
      if (course.paid_students.includes(id) || user.courses.includes(courseId))
        return res.send("Student Already Enrolled");

      user.courses.push(courseId);
      user.save()
      course.paid_students.push(id);
      course.save((err) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        } else {
          return res.status(200).json({
            message: "Student enrolled successfully",
            status: "ok",
          });
        }
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
};

module.exports = {
  courses,
  uploadImage,
  uploadVideo,
  deleteVideo,
  deleteImage,
  createCourse,
  updateCourse,
  getCourse,
  getCourses,
  addLesson,
  updateLesson,
  deleteLesson,
  publishCourse,
  unpublishCourse,
  checkEnrollment,
  enroll,
};
