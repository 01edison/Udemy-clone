import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  SettingOutlined,
  SyncOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { userActions } from "../../store/user-slice";
import { Button } from "antd";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  console.log(user);
  const becomeInstructor = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/become-instructor", {
        secretKey,
      });
      console.log(data);
      setSecretKey("");
      toast.success(data.msg);
      dispatch(userActions.updateRole());
      router.push("/instructor/course/create");
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data.err);
    }
    setLoading(false);
  };
  useEffect(() => {}, []);
  return (
    <UserRoute>
      <h1 className="jumbotron square text-center">Become Instructor</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-1">
              <UserSwitchOutlined className="display-1" />
              <h2>Setup account to publish courses on Udemy-clone</h2>
              <p>
                Udemy-clone partners with paystack to transfer earnings to your
                bank account. Please{" "}
                <a href="https://dashboard.paystack.com/#/login" target="_blank">sign up</a> on
                paystack to retrieve your Secret key.
              </p>
              <form>
                <input
                  className="form-control mb-2"
                  placeholder="Enter Paystack Public key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />

                <Button
                  className="mb-3"
                  block
                  shape="round"
                  size="large"
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={becomeInstructor}
                  disabled={loading || !secretKey}
                >
                  {loading ? <SyncOutlined spin /> : "Setup Instructor Account"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default BecomeInstructor;
