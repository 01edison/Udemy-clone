import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { authActions } from "../store/user-slice";

export default function Home() {

  return <h1 className="jumbotron text-center square">Udemy Clone</h1>;
}
