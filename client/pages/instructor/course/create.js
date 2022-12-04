import React, { useEffect } from "react";
import axios from "axios";
import UserRoute from "../../../components/routes/UserRoute";

const CreateCourse = () => {
  return (
    <UserRoute>
      <h1 className="jumbotron square text-center">Create Course</h1>
    </UserRoute>
  );
};

export default CreateCourse;
