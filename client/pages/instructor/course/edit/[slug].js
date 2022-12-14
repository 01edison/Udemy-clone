import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import UpdateLessonForm from "../../../../components/lesson/UpdateLessonForm";

import { Select, Avatar, Badge, List, Modal } from "antd";
import { SyncOutlined, DeleteFilled, EditFilled } from "@ant-design/icons";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Option } = Select;
const { Item } = List;
const EditCourse = () => {
  const router = useRouter();
  const { slug } = router.query;
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
    paid: "",
    uploading: false,
    lessons: [],
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageUploadText, setImageUploadText] = useState("Upload Image");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentLesson, setCurrentLesson] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/course/${slug}`);
        setCourse(data);
        setImagePreview(data?.image?.location);
        setImage({
          ...image,
          location: data?.image?.location,
          key: data?.image?.key,
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [slug]);

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
          setImageUploadText("Image uploaded!");
          setImage({ ...image, key, location });
        } catch (e) {
          console.log(e);
          toast.error(
            "Error uploading Image to AWS S3. Retry uploading image."
          );
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
      setImageUploadText("Upload Image");
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
      const { data } = await axios.patch(`/api/course`, {
        ...course,
        image,
      });
      console.log(data);
      toast.success("Course Updated successfully!");
      router.push("/instructor");
    } catch (e) {
      console.log(e);
      toast.error("Oops something went wrong");
    }
  };

  const deleteLesson = async (index, item) => {
    try {
      const confirmed = confirm("Are you sure you want to delete this lesson?");
      if (confirmed) {
        const filteredLessons = course.lessons.filter(
          (lesson, id) => id !== index
        );
        setCourse({ ...course, lessons: filteredLessons });
        toast(`Deleting ${item.title}...`);
        const { data } = await axios.delete(
          `/api/course/delete-lesson/${slug}/${item.title}`
        );
        toast.success(data.msg);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron square text-center">Update Course</h1>
      {JSON.stringify(course)}
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
          />

          <div className="row mb-3">
            <div className="col-md-8">
              <Select
                style={{ width: "100%" }}
                value={course.paid}
                onChange={(value) => setCourse({ ...course, paid: value })}
              >
                <Option value={true}>Paid</Option>
                <Option value={false}>Free</Option>
              </Select>
            </div>
            {course?.paid && (
              <div className="col-md-4">
                <div class="input-group mb-3">
                  <span class="input-group-text">???</span>
                  <input
                    type="number"
                    class="form-control"
                    name="price"
                    value={course?.price}
                    onChange={handleChange}
                    required
                  />
                  <span class="input-group-text">.00</span>
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            name="category"
            className="form-control mb-3"
            value={course?.category}
            required
            onChange={handleChange}
            placeholder="Enter Course Category"
          />
          <div className="row">
            <div className="col-md-6">
              <label className="w-100 btn btn-primary">
                {course?.uploading ? <SyncOutlined spin /> : imageUploadText}
                <input
                  className="btn btn-primary"
                  type="file"
                  name="image"
                  onChange={handleImage}
                  value={course?.imagePreview}
                  hidden
                  disabled={image?.location ? true : false}
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
              loading ||
              !course.name ||
              !course.description ||
              !course.category ||
              !image.location
            }
          >
            {loading ? <SyncOutlined spin /> : "Update Course"}
          </button>
        </form>
        <hr />
        <div className="row pb-5">
          <div className="col">
            <h4>{course?.lessons?.length} Lessons</h4>
            <Modal
              title="Update Lesson"
              centered
              open={isModalOpen}
              onCancel={() => {
                setIsModalOpen(false);
                setCurrentLesson({});
              }}
              footer={null}
            >
              <UpdateLessonForm
                currentLesson={currentLesson}
                setCurrentLesson={setCurrentLesson}
                course={course}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setCourse={setCourse}
                slug={slug}
              />
            </Modal>
            <List
              dataSource={course?.lessons}
              renderItem={(item, index) => (
                <Item>
                  <Item.Meta
                    avatar={<Avatar>{index + 1}</Avatar>}
                    title={item.title}
                    description={item.content}
                  ></Item.Meta>

                  <EditFilled
                    className="mr-4 pointer"
                    onClick={() => {
                      setCurrentLesson(item);
                      setIsModalOpen(true);
                    }}
                  />
                  <DeleteFilled
                    className="pointer text-danger"
                    onClick={() => {
                      deleteLesson(index, item);
                    }}
                  />
                </Item>
              )}
            ></List>
          </div>
        </div>
        <br />
      </div>
    </InstructorRoute>
  );
};

export default EditCourse;
