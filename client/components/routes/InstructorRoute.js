import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import InstructorNav from "../../components/nav/InstructorNav";

const InstructorRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();

  useEffect(() => {
    if (!user?.role?.includes("Instructor")) {
      toast.error("Sorry, this route is for instructors");
      router.push("/user");
    }
  }, []);

  return (
    user && (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <InstructorNav />
          </div>
          <div className="col-md-10">{children}</div>
        </div>
      </div>
    )
  );
};

export default InstructorRoute;
