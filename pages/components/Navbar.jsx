import React, { useState } from "react";
import { Flex, Image, Box, Spacer, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../../store/userSlice";
import CreateContributorComponent from "./CreateContributorComponent";
import ProfileComponent from "./ProfileComponent";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Navbar() {
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const [
    isOpenCreateContributorComponent,
    setIsOpenCreateContributorComponent,
  ] = useState(false);
  const [isOpenProfileComponent, setIsOpenProfileComponent] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("manualLogin");
    dispatch(setUserInfo({}));
  };

  const fetchUser = async () => {
    const res = await fetch(API_URL + "token", {
      method: "get",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      dispatch(setUserInfo(data.user));
    }
  };

  const handleContributorClick = () => {
    if (user.contributor === false || user.verified === false) {
      setIsOpenCreateContributorComponent(true);
    }
  };

  const handleProfileClick = () => {
    if (user.contributor === true) {
      setIsOpenProfileComponent(true);
    }
  };

  return (
    <>
      <Flex>
        <Box p="6" pt="8">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL}/Racks.png`}
            alt="Racks Labs"
            w="180px"
          />
        </Box>
        <Spacer />
        <Box p="10" className="flex items-center">
          {user.role === "user" && user.contributor && (
            <Button
              onClick={handleProfileClick}
              variant="outline"
              mr="1rem"
              bg="transparent"
              borderColor={"#FEFE0E"}
              color="white"
              borderRadius={"none"}
              _hover={{
                bg: "#FEFE0E",
                color: "black",
                transition: "0.5s",
              }}
              _active={{
                bg: "#FEFE0E",
                color: "black",
                transition: "0.5s",
                transform: "scale(1.05)",
              }}
            >
              {user.verified ? <>Profile</> : <> Completar Registro</>}
            </Button>
          )}
          {user.role === "user" && user.address && !user.contributor && (
            <Button
              onClick={handleContributorClick}
              variant="outline"
              mr="1rem"
              bg="transparent"
              borderColor={"#FEFE0E"}
              color="white"
              borderRadius={"none"}
              _hover={{
                bg: "#FEFE0E",
                color: "black",
                transition: "0.5s",
              }}
              _active={{
                bg: "#FEFE0E",
                color: "black",
                transition: "0.5s",
                transform: "scale(1.05)",
              }}
            >
              Contributor
            </Button>
          )}
          {user.role === "admin" && localStorage.getItem("manualLogin") ? (
            <Button
              onClick={handleLogout}
              variant="solid"
              mr="1rem"
              bg="#FEFE0E"
              color="black"
              borderRadius={"none"}
              _hover={{
                bg: "#d8d80e",
              }}
              _active={{
                bg: "#d8d80e",
                transform: "scale(1.05)",
              }}
            >
              Logout
            </Button>
          ) : (
            <ConnectButton
              accountStatus="address"
              showBalance={false}
              variant="outline"
            />
          )}
        </Box>
      </Flex>
      <CreateContributorComponent
        isOpen={isOpenCreateContributorComponent}
        setIsOpen={setIsOpenCreateContributorComponent}
        fetchUser={fetchUser}
      />
      <ProfileComponent
        isOpen={isOpenProfileComponent}
        setIsOpen={setIsOpenProfileComponent}
        fetchUser={fetchUser}
      />
    </>
  );
}

export default Navbar;
