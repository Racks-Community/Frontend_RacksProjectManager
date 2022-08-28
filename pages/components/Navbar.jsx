import React from "react";
import { Flex, Image, Box, Spacer, Center } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <>
      <Flex>
        <Box p="6">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL}/Racks.png`}
            alt="Racks Labs"
            w="180px"
          />
        </Box>
        <Spacer />
        <Box p="10" className="flex items-center">
          <ConnectButton showBalance={false} />
        </Box>
      </Flex>
    </>
  );
}

export default Navbar;
