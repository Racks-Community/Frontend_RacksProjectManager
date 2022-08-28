import { Container, Text, Heading } from "@chakra-ui/react";
import React from "react";

function Projects() {
  return (
    <>
      <Container py={"2rem"} h="40vw">
        <Heading as="h1" textAlign={"center"} mb="2rem">
          Racks Project Manager
        </Heading>
        <Text textAlign={"center"} fontSize={"1rem"}>
          Projects...
        </Text>
      </Container>
    </>
  );
}

export default Projects;
