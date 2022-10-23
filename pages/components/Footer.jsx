import { Container, Divider, Link, Text } from "@chakra-ui/react";
import React from "react";

function Footer() {
  return (
    <>
      <Divider
        w={"80%"}
        mx={"auto"}
        mt="2rem"
        style={{ borderColor: "#FEFE0E" }}
      />
      <Container className="footer-box">
        <Text
          textAlign={"center"}
          fontSize={"1rem"}
          className="footer-rackslabs"
        >
          <Link isExternal href="https://twitter.com/rackslabs">
            Racks Labs
          </Link>
        </Text>
      </Container>
    </>
  );
}

export default Footer;
