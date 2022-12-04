import React from "react";
import Link from "next/link";

const UserNav = () => {
  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/user">Dashboard</Link>
    </div>
  );
};

export default UserNav;
