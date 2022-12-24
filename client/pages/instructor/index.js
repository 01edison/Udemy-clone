import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import axios from "axios";
import Link from "next/link";
import InstructorRoute from "../../components/routes/InstructorRoute";

const Instructor = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: _courses } = await axios.get("/api/courses");
        setCourses(_courses);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    })();
  }, []);

  const P = ({ text, status }) => {
    return (
      <p
        style={{ fontSize: ".8rem", marginTop: "-15px" }}
        className={`text-${status}`}
      >
        {text}
      </p>
    );
  };
  return (
    <InstructorRoute>
      <h1 className="jumbotron square text-center">Instructor dashboard</h1>
      {loading ? (
        <SyncOutlined spin />
      ) : (
        courses &&
        courses.map((course) => (
          <div className="media">
            <Avatar key={course._id} src={course.image.location} size={80} />
            <div className="media-body ml-3">
              <div className="row">
                <div className="col">
                  <Link
                    href={`/instructor/course/view/${course.slug}`}
                    className="h5 mt-2 text-primary"
                  >
                    {course.name}
                  </Link>
                  <p>{course.lessons.length} lessons</p>

                  {course.lessons.length < 5 ? (
                    <P
                      text={
                        "At least 5 lessons are required to publish a course"
                      }
                      status={"danger"}
                    ></P>
                  ) : course.published ? (
                    <P
                      text={"Your course is live on the market!"}
                      status={"success"}
                    ></P>
                  ) : (
                    <P
                      text={"Your course is ready to be published"}
                      status={"success"}
                    ></P>
                  )}
                </div>
                <div className="col-md-3 mt-3 text-center">
                  {course.published ? (
                    <Tooltip title="Published">
                      <CheckCircleOutlined className="text-success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unpublished">
                      <CloseCircleOutlined className="text-danger" />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </InstructorRoute>
  );
};

export default Instructor;
