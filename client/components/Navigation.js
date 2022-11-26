import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Item } = Menu;
const Navigation = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setCurrent(window.location.pathname);
  });

  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item key="/" onClick={(e) => setCurrent(e.key)} icon={<HomeOutlined />}>
        <Link href={"/"} style={{ textDecoration: "none" }}>
          Home
        </Link>
      </Item>
      <Item
        onClick={(e) => setCurrent(e.key)}
        key="/login"
        icon={<LoginOutlined />}
      >
        <Link href={"/login"} style={{ textDecoration: "none" }}>
          Login
        </Link>
      </Item>
      <Item
        key="/register"
        onClick={(e) => setCurrent(e.key)}
        icon={<UserAddOutlined />}
      >
        <Link href={"/register"} style={{ textDecoration: "none" }}>
          Register
        </Link>
      </Item>
    </Menu>
  );
};

export default Navigation;
