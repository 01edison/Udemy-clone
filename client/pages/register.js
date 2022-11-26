import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Url } from "../constants";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";

const register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const body = { name, email, password };
    axios
      .post(`/api/register`, body)
      .then((res) => {
        toast.success("Registration Successful. Please login.");
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.response.data.err);
        setLoading(false);
      });
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-4"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
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
            disabled={loading || !name || !email || !password}
          >
            {loading ? <SyncOutlined spin /> : "Register"}
          </button>
        </form>
        <p className="text-center p-3">
          Already Registered?
          <Link href="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default register;
