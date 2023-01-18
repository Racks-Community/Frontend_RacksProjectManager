import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Flex, Image, Box, Spacer, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../../store/userSlice";
import CreateContributorComponent from "./CreateContributorComponent";
import CompleteRegisterComponent from "./CompleteRegisterComponent";
import { useRouter } from "next/router";
import { getMRCImageUrlFromAvatar } from "../../helpers/MRCImages";
import { ObjectIsNotEmpty } from "../../helpers/ObjectIsNotEmpty";
import { getTokenAPI } from "../../helpers/APICalls";

function Navbar() {
  const router = useRouter();
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [
    isOpenCreateContributorComponent,
    setIsOpenCreateContributorComponent,
  ] = useState(false);
  const [isOpenProfileComponent, setIsOpenProfileComponent] = useState(false);
  const [selectedMRC, setSelectedMRC] = useState(null);

  const outlineStyleBtn = {
    bg: "#FEFE0E",
    color: "black",
    transition: "0.5s",
  };

  const handleLogout = () => {
    localStorage.removeItem("address");
    localStorage.removeItem("token");
    localStorage.removeItem("manualLogin");
    router.reload();
  };

  const fetchUserCall = async () => {
    const data = await getTokenAPI();
    dispatch(setUserInfo(data.user));
  };

  const handleContributorClick = () => {
    if (user.contributor === false || user.verified === false) {
      setIsOpenCreateContributorComponent(true);
    }
  };

  const handleFAQClick = () => {
    router.push("/faq");
  };

  const handleProfileClick = () => {
    if (user.contributor === true) {
      setIsOpenProfileComponent(true);
    }
  };

  useEffect(() => {
    if (user.contributor && user.verified && user.avatar) {
      (async () => {
        const mrc = await getMRCImageUrlFromAvatar(user.avatar);
        setSelectedMRC(mrc);
      })();
    }
    if (
      !localStorage.getItem("token") &&
      !ObjectIsNotEmpty(user) &&
      window.location.pathname != "/admin" &&
      window.location.pathname != "/faq"
    ) {
      localStorage.removeItem("address");
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    const loginAddress = localStorage.getItem("address");
    if (isConnected && loginAddress && address != loginAddress) {
      localStorage.removeItem("address");
      localStorage.removeItem("token");
      router.reload();
    }
  }, [address]);

  return (
    <>
      <Flex>
        <Box p="4" pt="4" className="navbar-logo-container">
          <Image
            src={"./Racks.png"}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
            alt="Racks Labs"
            w="180px"
            className="rackslabs-logo"
          />
        </Box>
        <Spacer />
        <Box pr="8" className="flex items-center navbar-buttons-container">
          {!ObjectIsNotEmpty(user) && (
            <Button
              onClick={handleFAQClick}
              className="custom-buttons"
              variant="outline"
              mr="1rem"
              bg="transparent"
              borderColor={"#FEFE0E"}
              color="white"
              borderRadius={"none"}
              _hover={outlineStyleBtn}
            >
              FAQ
            </Button>
          )}
          {user.role === "user" && user.contributor && (
            <>
              {user.verified ? (
                <>
                  {user.avatar && selectedMRC ? (
                    <Image
                      src={selectedMRC}
                      onClick={() => router.push("/profile")}
                      className="profile-picture"
                      borderRadius="full"
                      boxSize="60px"
                      mr="5"
                      alt="PFP"
                    />
                  ) : (
                    <Image
                      src={"./fallback.gif"}
                      onClick={() => router.push("/profile")}
                      style={{ cursor: "pointer" }}
                      borderRadius="full"
                      boxSize="60px"
                      mr="5"
                      alt="PFP"
                    />
                  )}
                </>
              ) : (
                <Button
                  onClick={handleProfileClick}
                  className="custom-buttons"
                  variant="outline"
                  mr="1rem"
                  bg="transparent"
                  borderColor={"#FEFE0E"}
                  color="white"
                  borderRadius={"none"}
                  _hover={outlineStyleBtn}
                >
                  Completar Registro
                </Button>
              )}
            </>
          )}
          {user.role === "user" && user.address && !user.contributor && (
            <Button
              onClick={handleContributorClick}
              className="custom-buttons"
              variant="outline"
              mr="1rem"
              bg="transparent"
              borderColor={"#FEFE0E"}
              color="white"
              borderRadius={"none"}
              _hover={outlineStyleBtn}
            >
              Registro
            </Button>
          )}
          {user.role === "admin" && (
            <Button
              onClick={() => router.push("/contributors")}
              className="custom-buttons"
              variant="outline"
              mr="1rem"
              bg="transparent"
              borderColor={"#FEFE0E"}
              color="white"
              borderRadius={"none"}
              _hover={outlineStyleBtn}
            >
              Holders
            </Button>
          )}
          {user.role === "admin" && localStorage.getItem("manualLogin") ? (
            <Button
              onClick={handleLogout}
              className="custom-buttons logoutBtn"
              variant="solid"
              bg="#FEFE0E"
              color="black"
              borderRadius={"none"}
              _hover={{
                bg: "#d8d80e",
              }}
            >
              Logout
            </Button>
          ) : (
            <div className={!user.address ? "connect-button" : "wallet-button"}>
              <ConnectButton
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
                variant="outline"
              />
            </div>
          )}
        </Box>
      </Flex>
      <CreateContributorComponent
        isOpen={isOpenCreateContributorComponent}
        setIsOpen={setIsOpenCreateContributorComponent}
        fetchUser={fetchUserCall}
      />
      <CompleteRegisterComponent
        isOpen={isOpenProfileComponent}
        setIsOpen={setIsOpenProfileComponent}
        fetchUser={fetchUserCall}
      />
    </>
  );
}

export default Navbar;
