import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import UserNav from "../../components/nav/UserNav";

const UserRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  if (!user) router.push("/login");
  else {
    return (
      user && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <UserNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )
    );
  }
};

export default UserRoute;
