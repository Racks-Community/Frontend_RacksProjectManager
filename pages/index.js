import React, { useState, useEffect } from "react";
import Projects from "./components/Projects";
import ConnectWallet from "./components/ConnectWallet";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import { ObjectIsNotEmpty } from "./helpers/ObjectIsNotEmpty";

const Home = () => {
  const user = useSelector(selectUserInfo);
  const [isNotConnected, setIsNotConnected] = useState(true);

  const checkNotConnected = () => {
    return !localStorage.getItem("token") && !ObjectIsNotEmpty(user);
  };

  useEffect(() => {
    setIsNotConnected(checkNotConnected());
  }, [user]);

  return <>{isNotConnected ? <ConnectWallet /> : <Projects />}</>;
};

export default Home;
