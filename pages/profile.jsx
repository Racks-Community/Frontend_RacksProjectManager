import {
  Container,
  Text,
  Heading,
  Box,
  Button,
  Center,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Projects() {
  const user = useSelector(selectUserInfo);

  return (
    <>
      <Container
        className="flex flex-col items-center projects-container"
        mt={"-1rem"}
      >
        <Heading as="h1" mb="2rem">
          Contributor Profile
        </Heading>
      </Container>
    </>
  );
}

export default Projects;
