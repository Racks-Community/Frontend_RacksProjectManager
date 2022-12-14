import React, { useEffect } from "react";
import { Container, Text, Heading, Center, VStack } from "@chakra-ui/react";
import { initParticleSlider } from "../../helpers/Particles";
import Loading from "./Loading";

function ConnectWallet() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.getElementById("ParticleSlider");
      if (!script) {
        initParticleSlider();
      }
    }
  }, []);

  return (
    <>
      <Loading />
      <Heading as="h1" textAlign={"center"} className="rackspm-heading">
        Racks Project Manager
      </Heading>
      <Container
        className="flex flex-col items-center justify-center connect-wallet-container"
        mt="-1rem"
      >
        <VStack className="connect-wallet-box">
          <Center>
            <Heading
              as="h2"
              fontSize="1.8rem"
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
              <div className="particle-spacer" />
            </Heading>
          </Center>
          <div id="particle-slider">
            <div className="slides">
              <div id="first-slide" className="slide"></div>
            </div>
            <canvas className="draw"></canvas>
          </div>
          <Center mt="1.5rem">
            <Text
              className="connect-wallet-subtext"
              fontSize="1.2rem"
              color="gray"
            >
              Conecta una cartera con al menos un Mr.Crypto
            </Text>
          </Center>
        </VStack>
      </Container>
    </>
  );
}

export default ConnectWallet;
