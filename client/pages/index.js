import axios from "axios";
import { useEffect, useState } from "react";
import { Url } from "../constants";
import CourseCard from "../components/card/CourseCard";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { authActions } from "../store/user-slice";

export async function getServerSideProps() {
  const { data } = await axios.get(`${Url}/live-courses`);
  return {
    props: {
      liveCourses: data,
    },
  };
}

export default function Home({ liveCourses }) {
  return (
    <>
      <h1 className="jumbotron text-center square">Udemy Clone</h1>
      <div className="container-fluid">
        <div className="row">
          {liveCourses?.map((course) => (
            <div className="col-md-4" key={course._id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
