import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const User = () => {
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.user.user);
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
          router;
        });
    }
  }, []);
  return (
    <>
      <h1 className="jumbotron text-center square">User page</h1>
      <h3>{userData?.name}</h3>
      <h3>{userData?.email}</h3>
    </>
  );
};

export default User;
