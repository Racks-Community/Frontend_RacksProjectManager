import { Container, Text, Heading, Center } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function ConnectWallet() {
  return (
    <>
      <Heading as="h1" textAlign={"center"} className="rackspm-heading">
        Racks Project Manager
      </Heading>
      <Container
        className="flex flex-col items-center justify-center connect-wallet-container"
        mt="-1rem"
        mb="2.7rem"
      >
        <Center>
          <Heading
            as="h2"
            fontSize="1.8rem"
            mx="auto"
            mt="0rem"
            style={{ lineHeight: "5rem" }}
            className="connect-wallet-heading"
          >
            Contribuye con los desarrollos de
            <Text
              fontSize="4rem"
              style={{ color: "#FEFE0E" }}
              className="connect-wallet-text"
            >
              Racks <br /> Community
            </Text>
          </Heading>
        </Center>
        <Center mt="1.5rem">
          <Text
            className="connect-wallet-subtext"
            fontSize="1.2rem"
            color="gray"
          >
            Conecta una cartera con al menos un Mr.Crypto
          </Text>
        </Center>
      </Container>
    </>
  );
}

export default ConnectWallet;
