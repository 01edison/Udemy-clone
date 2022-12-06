const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    video_link: {
      type: String,
      required: true,
    },
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lesson = new model("lesson", lessonSchema);

module.exports = { Lesson, lessonSchema };
