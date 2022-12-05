import React, { useState, useEffect } from "react";
import Link from "next/link";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setCurrent(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link
        href="/user"
        className={`nav__link ${current === "/user" ? "active" : ""}`}
      >
        Dashboard
      </Link>
    </div>
  );
};

export default UserNav;
