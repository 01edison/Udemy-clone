const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../utils/s3Client");
const ShortUniqueId = require("short-unique-id");
const Course = require("../models/course");
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
  const { key } = req.body;
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
    return res.json({
      msg: `Object with key: ${videoParams.Key} deleted from Bucket successfully`,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};

const createCourse = (req, res) => {
  try {
    const { id: instructorId } = req.profile;
    const { name, description, category, price, paid, image } = req.body;
    Course.findOne({ name: slugify(name) }, (err, course) => {
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
          course.lessons.push(_lesson);
          course.save((err) => {
            if (!err) {
              return res.status(201).send(course);
            } else {
              return res.status(400).json({ err });
            }
          });
        } else {
          return res.status(400).json({ err });
        }
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};
module.exports = {
  uploadImage,
  uploadVideo,
  deleteVideo,
  deleteImage,
  createCourse,
  getCourse,
  getCourses,
  addLesson,
};
