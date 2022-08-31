import React from "react";
import { Flex, Image, Box, Spacer, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../../store/userSlice";

function Navbar() {
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  console.log(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          {user.role === "admin" ? (
            <Button
              onClick={handleLogout}
              colorScheme="teal"
              variant="outline"
              mr="1rem"
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
