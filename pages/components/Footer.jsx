import { Container, Divider, Link, Text } from "@chakra-ui/react";
import React from "react";

function Footer() {
  return (
    <>
      <Divider
        w={"80%"}
        mx={"auto"}
        mt="1.3rem"
        style={{ borderColor: "#FEFE0E" }}
      />
      <Container py={"1.5rem"}>
        <Text textAlign={"center"} fontSize={"1rem"}>
          <Link isExternal href="https://twitter.com/rackslabs">
            Racks Labs
          </Link>
        </Text>
      </Container>
    </>
  );
}

export default Footer;
