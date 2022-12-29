import React, { useState, useEffect } from "react";
import { Badge, Button } from "antd";
import axios from "axios";
import { Url } from "../../constants";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import format from "format-number";
import PreviewModal from "../../components/PreviewModal";
import CourseLessons from "../../components/lesson/CourseLessons";

const SingleCourse = ({ course }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [media, setMedia] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const router = useRouter();
  const { user } = useSelector((state) => state.user);

  const {
    _id,
    name,
    slug,
    description,
    price,
    instructor,
    lessons,
    image,
    paid,
    category,
    updatedAt,
  } = course;
  console.log(course);
  const handlePlay = async (e) => {
    e.preventDefault();
    setIsPlaying(true);
    setShowModal(!showModal);
    setMedia(lessons[0]?.video?.location);
  };

  const checkEnrollment = async () => {
    try {
      const { data } = await axios.get(`/api/check-enrollment/${_id}`);
      console.log(data);
      setIsEnrolled(data);
    } catch (e) {
      console.log(e);
    }
  };

  const onSuccess = (reference) => {
    axios
      .post(`/api/course-enrollment/${_id}`)
      .then((res) => {
        toast.success(res.data.message || res.data);
        router.push(`/user/course/${slug}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onClose = () => {};

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email,
    amount: price * 100,
    publicKey: instructor?.paystackPublicKey,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaidEnrollment = async () => {
    if (!user) router.push("/login");
    else {
      setLoading(true);
      try {
        initializePayment(onSuccess, onClose);
      } catch (e) {
        console.log(e);
        toast.error("Enrollment failed. Please try again later");
      }
      setLoading(false);
      checkEnrollment();
    }
  };

  const handleFreeEnrollment = async () => {
    if (!user) router.push("/login");
    else {
      setLoading(true);
      try {
        const { data } = await axios.post(`/api/course-enrollment/${_id}`);
        toast.success(data.message || data);
        router.push(`/user/course/${slug}`);
      } catch (e) {
        console.log(e);
        toast.error("Enrollment failed. Please try again ");
      }
      setLoading(false);
      checkEnrollment();
    }
  };

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, []);
  return (
    <>
      <div className="jumbotron bg-primary square">
        <PreviewModal
          showModal={showModal}
          setShowModal={setShowModal}
          media={media}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        {JSON.stringify(course.slug)}
        <div className="row">
          <div className="col-md-8">
            <h1>{name}</h1>
            <p>{description}</p>
            <Badge
              count={category}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-2 mr-2"
            />
            <p>Created by {instructor.name}</p>
            <p>Last Updated: {new Date(updatedAt).toLocaleDateString()}</p>
            <h4>{paid ? format({ prefix: "₦" })(price) : "Free"}</h4>
          </div>
          <div className="col-md-4">
            {lessons && lessons[0] && lessons[0].free_preview ? (
              <div
                onClick={handlePlay}
                width="200px"
                height="120px"
                style={{
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ position: "absolute", fontSize: "70px" }}>
                  <PlayCircleOutlined />
                </span>
                <img
                  src={image.location}
                  width="100%"
                  height="190px"
                  style={{ objectFit: "none" }}
                />
              </div>
            ) : (
              <div
                width="200px"
                height="120px"
                style={{
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={image.location}
                  width="100%"
                  height="190px"
                />
              </div>
            )}
            <Button
              shape={"primary"}
              className="w-100 mt-3"
              size="large"
              onClick={
                isEnrolled
                  ? () => {
                      router.push(`/user/course/${slug}`);
                    }
                  : paid
                  ? handlePaidEnrollment
                  : handleFreeEnrollment
              }
            >
              {loading ? (
                <SyncOutlined spin />
              ) : user ? (
                isEnrolled ? (
                  "Go to course"
                ) : (
                  "Enroll"
                )
              ) : (
                "Login to Enroll"
              )}
            </Button>
          </div>
        </div>
      </div>

      {lessons && (
        <CourseLessons
          lessons={lessons}
          setMedia={setMedia}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const { data } = await axios.get(`${Url}/course/${slug}`, {
    headers: context?.req?.headers?.cookie
      ? { cookie: context.req.headers.cookie }
      : undefined,
  });

  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
