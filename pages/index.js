import Projects from "./components/Projects";
import ConnectWallet from "./components/ConnectWallet";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";

const Home = () => {
  const user = useSelector(selectUserInfo);
  return <>{user.address ? <Projects /> : <ConnectWallet />}</>;
};

export default Home;
