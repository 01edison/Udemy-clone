import React, { useEffect, useState } from "react";
import axios from "axios";
import { authActions } from "../../store/user-slice";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import UserNav from "../../components/nav/UserNav";
import UserRoute from "../../components/routes/UserRoute";

const User = () => {
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else {
      axios
        .get("/api/user")
        .then((res) => {
          const { user } = res.data;
          setUserData(user);
        })
        .catch((e) => {
          console.log(e);
          dispatch(authActions.logout());
          router.push("/login");
          toast(e.response?.data.err);
        });
    }
  }, []);
  return (
    <UserRoute>
      <h1 className="jumbotron square text-center">User Dashboard</h1>
    </UserRoute>
  );
};

export default User;
