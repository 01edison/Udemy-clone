import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Switch } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const UpdateLessonForm = ({
  currentLesson,
  setCurrentLesson,
  course,
  setCourse,
  slug,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");
  let formData = new FormData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson({ ...currentLesson, [name]: value });
  };

  const handleVideo = async (e) => {
    setVideoUploading(true);
    try {
      if (currentLesson?.video?.location) {
        toast("Deleting video from S3. Please wait");
        const { data } = await axios.post(`/api/course/delete-video/${slug}`, {
          video: currentLesson.video,
          lessonTitle: currentLesson.title,
        });
        console.log(data);
        setCurrentLesson({ ...currentLesson, video: {} });
        toast("Video deleted successfully");
      }
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
      setCurrentLesson({ ...currentLesson, video: data });
      setUploadVideoButtonText(videoFile.name);
    } catch (e) {
      console.log(e);
      toast.error("Error uploading video. Please refresh and try again.");
    }
    setVideoUploading(false);
  };

  const updateLesson = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const { data } = await axios.put(
        `/api/course/update-lesson/${slug}/${course.instructor._id}`,
        { currentLesson }
      );
      setCurrentLesson({ title: "", content: "", video: {} });
      toast.success("Lesson updated successfully!");
      setCourse(data);
      setIsModalOpen(!isModalOpen)
      setUploadVideoButtonText("Upload Video");
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.err?.message || "Lesson not added. Try again");
    }
    setUploading(false);
  };

  return (
    <div className="container pt-3">
      <form onSubmit={updateLesson}>
        <input
          type="text"
          name="title"
          className="form-control"
          value={currentLesson?.title}
          placeholder="title"
          required
          onChange={handleChange}
        />

        <textarea
          className="form-control mt-3"
          placeholder="content"
          value={currentLesson?.content}
          onChange={handleChange}
          required
          name="content"
        />

        <div>
          {!videoUploading &&
            currentLesson.video &&
            currentLesson.video?.location && (
              <div className="pt-2 d-flex justify-content-center">
                <video
                  src={currentLesson.video.location}
                  width={"410px"}
                  height={"240px"}
                  controls
                />
              </div>
            )}
          <label className="btn btn-dark btn-block mt-1">
            {videoUploading ? <SyncOutlined spin /> : uploadVideoButtonText}
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideo}
              disabled={videoUploading}
              // required
            />
          </label>
        </div>
        <div className="d-flex justify-content-between">
          <span className="pt-3 badge">Preview</span>
          <Switch
            className="mt-2"
            disabled={videoUploading}
            defaultChecked={currentLesson.free_preview}
            name="free_preview"
            onChange={(v) =>
              setCurrentLesson({ ...currentLesson, free_preview: v })
            }
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block mt-3 round"
          style={{ borderRadius: "1.5rem" }}
        >
          {uploading ? <SyncOutlined spin /> : "Update Lesson"}
        </button>
      </form>
      {JSON.stringify(currentLesson)}
    </div>
  );
};

export default UpdateLessonForm;
