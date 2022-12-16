import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import AddLessonForm from "../../../../components/AddLessonForm";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";

const { Item } = List;
const InstructorCourseView = () => {
  const [course, setCourse] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/course/${slug}`);
        console.log(data);
        setCourse(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [slug]);

  return (
    <InstructorRoute>
      {course && (
        <div className="container-fluid pt-3">
          <div className="media">
            <Avatar
              src={course.image ? course.image.location : "/course.png"}
              size={80}
              alt={course?.name}
            />
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <h5 className="mt-2 text-primary">{course?.name}</h5>
                  <p style={{ marginTop: "-10px" }}>
                    {course?.lessons?.length} Lessons
                  </p>
                  <p style={{ marginTop: "-15px", fontSize: "12px" }}>
                    {course?.category}
                  </p>
                </div>
                <div className="d-flex pt-4">
                  <Tooltip title="Edit">
                    <EditOutlined className="h5 pointer text-warning mr-4" />
                  </Tooltip>
                  <Tooltip title="Publish">
                    <CheckOutlined className="h5 pointer text-danger" />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <ReactMarkdown>{course?.description}</ReactMarkdown>
            </div>
          </div>
          <div className="row">
            <Button
              onClick={() => setIsModalOpen(true)}
              type="primary"
              shape="round"
              icon={<UploadOutlined />}
              className="col-md-6 offset-md-3 text-center"
              size="large"
            >
              Add Lesson
            </Button>
            <Modal
              title="Add Lesson"
              centered
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
            >
              <AddLessonForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                slug={slug}
                course={course}
                setCourse={setCourse}
              />
            </Modal>
          </div>
          <div className="row pb-5">
            <div className="col">
              <h4>{course?.lessons?.length} Lessons</h4>

              <List
                dataSource={course?.lessons}
                renderItem={(item, index) => (
                  <Item>
                    <Item.Meta
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={item.title}
                    ></Item.Meta>
                  </Item>
                )}
              ></List>
            </div>
          </div>
        </div>
      )}
    </InstructorRoute>
  );
};

export default InstructorCourseView;
