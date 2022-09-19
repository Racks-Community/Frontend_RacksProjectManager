import { Container, Text, Heading, Center } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function ConnectWallet() {
  return (
    <>
      <Heading as="h1" mt="0" textAlign={"center"} mt={"-1rem"}>
        Racks Project Manager
      </Heading>
      <Container className="flex flex-col items-center justify-center connect-wallet-container">
        <Center>
          <Heading as="h2" size="2xl" mx="auto" style={{ lineHeight: "5rem" }}>
            Contribuye con los desarrollos de
            <Text fontSize="5rem" style={{ color: "#FEFE0E" }}>
              {" "}
              Racks Community
            </Text>
          </Heading>
        </Center>
        <Center mt="2rem">
          <Text fontSize="2xl" color="gray">
            Conecta una cartera con al menos un Mr.Crypto
          </Text>
        </Center>
      </Container>
    </>
  );
}

export default ConnectWallet;
