import React from "react";
import { List, Avatar } from "antd";

const { Item } = List;
const CourseLessons = ({ lessons, setMedia, setShowModal, showModal }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {lessons && <h4>{lessons.length} lessons</h4>}
          <hr />
          <List
            dataSource={lessons}
            renderItem={(item, index) => (
              <Item>
                <Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                />
                  {item.video &&
                    item.video !== {} &&
                    item.video !== null &&
                    item.free_preview && (
                      <span
                      className="text-primary pointer"
                        onClick={() => {
                          setMedia(item.video.location);
                          setShowModal(!showModal);
                        }}
                      >
                        Preview
                      </span>
                    )}
              </Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseLessons;
