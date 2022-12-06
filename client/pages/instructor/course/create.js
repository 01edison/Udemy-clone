import React, { useEffect, useState } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import { Select, Avatar, Badge } from "antd";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

const { Option } = Select;
const CreateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({
    location: "",
    key: "",
  });
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
    const image = e.target?.files[0];
    setImagePreview(window.URL.createObjectURL(image));
    setCourse({ ...course, uploading: true });
    // resize
    Resizer.imageFileResizer(
      image,
      720,
      500,
      "JPEG",
      100,
      0,
      async (imageUri) => {
        try {
          toast("Uploading image to AWS storage");
          const {
            data: { location, key },
          } = await axios.post("/api/course/upload-image", {
            imageUri,
          });
          toast.success("Image uploaded successfully");
          setImage({ ...image, key, location });
        } catch (e) {
          console.log(e);
          toast.error("Error uploading Image to AWS S3");
        }
        setCourse({ ...course, uploading: false });
      }
    );
  };

  const removeImage = async () => {
    setCourse({ ...course, uploading: true });
    try {
      toast("Deleting image from aws bucket...");

      const { data } = await axios.post("/api/course/delete-image", {
        image,
      });

      toast.success("Image deleted successfully");
      setImage({ ...image, location: "", key: "" });
      setImagePreview("");
    } catch (e) {
      console.log(e);

      toast("Oops something went wrong, please try deleting again");
    }
    setCourse({ ...course, uploading: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/create-course", {
        ...course,
        image,
      });
    } catch (e) {
      console.log(e);
    }
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
            disabled
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
              <label className="w-100 btn btn-primary">
                {course.uploading ? <SyncOutlined spin /> : "Upload Image"}
                <input
                  className="btn btn-primary"
                  type="file"
                  name="image"
                  onChange={handleImage}
                  value={course.imagePreview}
                  hidden
                />
              </label>
            </div>

            {imagePreview && (
              <div className="col-md-6">
                <Badge count="X" onClick={removeImage} className="pointer">
                  <Avatar src={imagePreview} size={50} />
                </Badge>
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
            {loading ? <SyncOutlined spin /> : "Create Course"}
          </button>
        </form>
        {JSON.stringify(course, null, 4)} <br />
        {JSON.stringify(image, null, 4)}
      </div>
    </InstructorRoute>
  );
};

export default CreateCourse;
