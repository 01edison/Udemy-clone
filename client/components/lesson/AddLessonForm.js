import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Tooltip } from "antd";
import { CloseCircleFilled, SyncOutlined } from "@ant-design/icons";

const AddLessonForm = ({
  isModalOpen,
  setIsModalOpen,
  slug,
  course,
  setCourse,
}) => {
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    video: {},
  });

  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");

  let formData = new FormData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLesson({ ...lesson, [name]: value });
  };

  const uploadVideo = async (e) => {
    setVideoUploading(true);
    try {
      const videoFile = e.target.files[0];

      formData.append("video", videoFile);
      toast("Uploading Video to AWS S3. Please wait...");
      const { data } = await axios.post(
        `/api/course/upload-video/${course.instructor._id}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      toast.success("Video uploaded successfully");
      setLesson({ ...lesson, video: data });
      setUploadVideoButtonText(videoFile.name);
    } catch (e) {
      console.log(e);
      toast.error("Error uploading video");
    }
    setVideoUploading(false);
  };

  const addLesson = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const { data } = await axios.post(
        `/api/course/add-lesson/${slug}/${course.instructor._id}`,
        { lesson }
      );
      setLesson({ title: "", content: "", video: {} });
      toast.success("Lesson added successfully!");
      setCourse(data);
      setUploadVideoButtonText("Upload Video");
      setIsModalOpen(!isModalOpen);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.err.message || "Lesson not added. Try again");
    }
    setUploading(false);
  };

  const deleteVideo = async () => {
    setVideoUploading(true);
    try {
      toast("Deleting video from S3. Please wait");
      const { data } = await axios.post(
        "/api/course/delete-video",
        lesson.video
      );
      toast.success("Video deleted from S3 successfully");
      setUploadVideoButtonText("Upload Video");
      setLesson({ ...lesson, video: {} }); // set the video back to an empty object
    } catch (e) {
      console.log(e);
      toast.error("Error removing video from S3. Try again");
    }
    setVideoUploading(false);
  };

  return (
    <div className="container pt-3">
      <form onSubmit={addLesson}>
        <input
          type="text"
          name="title"
          className="form-control"
          value={lesson.title}
          placeholder="title"
          required
          onChange={handleChange}
        />

        <textarea
          className="form-control mt-3"
          placeholder="content"
          value={lesson.content}
          onChange={handleChange}
          required
          name="content"
        />

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block mt-1">
            {videoUploading ? <SyncOutlined spin /> : uploadVideoButtonText}
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={uploadVideo}
              disabled={videoUploading}
              // required
            />
          </label>
          {!videoUploading && lesson.video.location && (
            <Tooltip title="delete video">
              <CloseCircleFilled
                className="pl-2 mt-3 pointer text-danger"
                onClick={deleteVideo}
              />
            </Tooltip>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block mt-3 round"
          style={{ borderRadius: "1.5rem" }}
          disabled={videoUploading || uploading}
        >
          {uploading ? <SyncOutlined spin /> : "Add Lesson"}
        </button>
      </form>
      {JSON.stringify(lesson)}
    </div>
  );
};

export default AddLessonForm;
