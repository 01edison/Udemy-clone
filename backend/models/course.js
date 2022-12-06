const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { lessonSchema } = require("./lesson");

const { ObjectId } = Schema;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 10000,
    },
    image: {
      type: {},
      required: true,
    },
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema],
    paid_students: [],
  },
  { timestamps: true }
);

const Course = new model("course", courseSchema);

module.exports = Course;
