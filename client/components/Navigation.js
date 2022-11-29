import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/user-slice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CoffeeOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Item, SubMenu } = Menu;
const Navigation = () => {
  const [current, setCurrent] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user.user);

  const logout = () => {
    dispatch(authActions.logout());
    axios
      .get("/api/logout")
      .then((res) => {
        console.log(res.data);
        toast(res.data.msg);
        router.push("/login");
      })
      .catch((e) => console.log(e));
  };

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

      {!user && (
        <Item
          onClick={(e) => setCurrent(e.key)}
          key="/login"
          icon={<LoginOutlined />}
        >
          <Link href={"/login"} style={{ textDecoration: "none" }}>
            Login
          </Link>
        </Item>
      )}

      {!user && (
        <Item
          key="/register"
          onClick={(e) => setCurrent(e.key)}
          icon={<UserAddOutlined />}
        >
          <Link href={"/register"} style={{ textDecoration: "none" }}>
            Register
          </Link>
        </Item>
      )}

      {user && (
        <SubMenu
          title={user?.name}
          style={{ marginLeft: "auto" }}
          icon={<CoffeeOutlined />}
        >
          <Item icon={<UserOutlined />} key="/user">
            <Link href="/user" style={{ textDecoration: "none" }}>
              Dashboard
            </Link>
          </Item>
          <Item onClick={logout} icon={<LogoutOutlined />}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default Navigation;
