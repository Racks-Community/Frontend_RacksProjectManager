import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Projects from "./components/Projects";
import ConnectWallet from "./components/ConnectWallet";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";

const Home = () => {
  const user = useSelector(selectUserInfo);
  return (
    <>
      <Navbar />
      {user.address ? <Projects /> : <ConnectWallet />}
      <Footer />
    </>
  );
};

export default Home;
