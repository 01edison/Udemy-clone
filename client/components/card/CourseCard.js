import React from "react";
import { Card, Badge } from "antd";
import Link from "next/link";
import format from "format-number";

const CourseCard = ({ course }) => {
  const { name, image, price, slug, instructor, category, paid } = course;

  return (
    <Link
      href={`course/${slug}`}
      className="pointer"
      style={{ textDecoration: "none" }}
    >
      <Card
        hoverable
        cover={
          <img
            src={image.location}
            style={{ objectFit: "cover", height: "200px" }}
          />
        }
        className="mb-5"
      >
        <h2>{name}</h2>
        <p>by {instructor.name}</p>
        <Badge count={category} style={{ backgroundColor: "#03a9f4" }} />
        <h4 className="pt-3">
          {paid ? format({ prefix: "₦" })(price) : "Free"}
        </h4>
      </Card>
    </Link>
  );
};

export default CourseCard;
