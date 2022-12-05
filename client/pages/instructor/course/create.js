import React, { useEffect, useState } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { Select, Avatar } from "antd";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

const { Option } = Select;
const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({
    name: "",
    description: "",
    category: "",
    price: 15000,
    paid: true,
    uploading: false,
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse({ ...course, [name]: value });
  };

  const handleImage = (e) => {
    const image = e.target.files[0];
    setImagePreview(window.URL.createObjectURL(image));
    setCourse({ ...course, uploading: true });

    // resize
    Resizer.imageFileResizer(image, 720, 500, "JPEG", 100, 0, async (image) => {
      try {
        const { data } = await axios.post("/api/course/upload-image", {
          image,
        });

        console.log(data);
      } catch (e) {
        console.log(e);
        toast.error("Error uploading Image to AWS S3");
      }
      setCourse({ ...course, uploading: false });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(course);
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron square text-center">Create Course</h1>
      <div className="pt-3 pb-3">
        <form className="form-group" onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="name"
            type="text"
            placeholder="Course Name"
            value={course.name}
            onChange={handleChange}
          />
          <textarea
            name="description"
            onChange={handleChange}
            className="form-control mb-3"
            value={course.description}
            placeholder="Course description"
            rows={7}
            maxLength="100"
          />

          <div className="row mb-3">
            <div className="col-md-8">
              <Select
                style={{ width: "100%" }}
                defaultValue={"What type of course?"}
                onChange={(value) => setCourse({ ...course, paid: value })}
              >
                <Option value={true}>Paid</Option>
                <Option value={false}>Free</Option>
              </Select>
            </div>
            {course.paid && (
              <div className="col-md-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Enter course price"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>
          <input
            type="text"
            name="category"
            className="form-control mb-3"
            value={course.category}
            onChange={handleChange}
            placeholder="Enter Course Category"
          />
          <div className="row">
            <div className="col-md-6">
              <label className="form-control">
                {course.uploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  value={course.imagePreview}
                />
              </label>
            </div>

            {imagePreview && (
              <div className="col-md-6">
                <Avatar src={imagePreview} size={50} />
              </div>
            )}
          </div>

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={
              loading || !course.name || !course.description || !course.category
            }
          >
            {loading ? <SyncOutlined /> : "Create Course"}
          </button>
        </form>
        {JSON.stringify(course, null, 4)}
      </div>
    </InstructorRoute>
  );
};

export default CreateCourse;
