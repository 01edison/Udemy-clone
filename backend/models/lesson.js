const { Schema, model } = require("mongoose");

const lessonSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true
    },
    video: {
      type: {},
      required: true,
    },
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lesson = new model("Lesson", lessonSchema);

module.exports = { Lesson, lessonSchema };
