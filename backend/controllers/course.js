const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../utils/s3Client");
const ShortUniqueId = require("short-unique-id");
const Course = require("../models/course");

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
    console.log({
      location: `https://${imageParams.Bucket}.s3.amazonaws.com/${imageParams.Key}`,
    });

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

const createCourse = (req, res) => {
  try {
    const { id: instructorId } = req.profile;
    console.log("instructor id => ", instructorId);
    console.log(req.body);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ err: e });
  }
};
module.exports = { uploadImage, deleteImage, createCourse };
