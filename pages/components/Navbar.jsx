import React from "react";
import { Flex, Image, Box, Spacer, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../../store/userSlice";

function Navbar() {
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("manualLogin");
    dispatch(setUserInfo({}));
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
            <ConnectButton showBalance={false} variant="outline" />
          )}
        </Box>
      </Flex>
    </>
  );
}

export default Navbar;
