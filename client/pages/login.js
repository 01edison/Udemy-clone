import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/user-slice";
import { Url } from "../constants";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const register = () => {
  const [email, setEmail] = useState("edison@email");
  const [password, setPassword] = useState("edison123");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const body = { email, password };
    axios
      .post(`/api/login`, body)
      .then((res) => {
        console.log(res.data.user);
        toast.success("Login Successful");
        dispatch(authActions.login(res.data.user));
        router.push("/");
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.response.data.err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) router.push("/");
  }, []);

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            className="form-control mb-4 p-4"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <br />
          <button
            type="submit"
            className="btn-block btn btn-primary"
            disabled={loading || !email || !password}
          >
            {loading ? <SyncOutlined spin /> : "Login"}
          </button>
        </form>
        <p className="text-center p-3">
          Don't have an account?
          <Link href="/register">Register</Link>
        </p>
      </div>
    </>
  );
};

export default register;
