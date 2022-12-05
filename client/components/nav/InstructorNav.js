import { useState, useEffect } from "react";
import Link from "next/link";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setCurrent(window.location.pathname);
  }, [window.location.pathname]);
  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link
        href="/instructor"
        className={`nav__link ${current === "/instructor" ? "active" : ""}`}
      >
        Dashboard
      </Link>

      <Link
        href="/instructor/course/create"
        className={`nav__link ${
          current === "/instructor/course/create" ? "active" : ""
        }`}
      >
        Create Course
      </Link>
    </div>
  );
};

export default InstructorNav;
