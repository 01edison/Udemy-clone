import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/");
  }, []);

  const getSecretCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { email };
      const res = await axios.post("/api/forgot-password", body);
      console.log(res.data);
      setSuccess(true);
      toast("Check your email for the secret code");
    } catch (e) {
      console.log(e);
      toast(e.response.data.err);
    }
    setLoading(false);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { code, email, newPassword };
      const res = await axios.post("/api/reset-password", body);
      console.log(res.data);
      toast("Password reset successfully!");
      setCode("");
      setNewPassword("");
      setEmail("");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (e) {
      console.log(e);
      toast(e.response.data.err);
    }
    setLoading(false);
  };

  return (
    <>
      <h1 className="jumbotron text-center square">Password Reset</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? resetPassword : getSecretCode}>
          <input
            type="email"
            value={email}
            className="form-control mb-3"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          {success && (
            <>
              <input
                type="text"
                value={code}
                className="form-control mb-3"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your secret code"
                required
              />
              <input
                type="password"
                value={newPassword}
                className="form-control"
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            disabled={loading || !email}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
