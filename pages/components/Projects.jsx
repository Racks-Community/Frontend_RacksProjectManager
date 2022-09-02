import React, { useState } from "react";
import { Container, Text, Heading, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import CreateProjectComponent from "./CreateProjectComponent";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Projects() {
  const user = useSelector(selectUserInfo);
  const [isOpenCreateProjectComponent, setIsOpenCreateProjectComponent] =
    useState(false);

  const handleDisplayCreateProject = () => {
    if (user.role === "admin") {
      setIsOpenCreateProjectComponent(true);
    }
  };

  return (
    <>
      <Container className="flex flex-col items-center" mt={"-1rem"} h="40vw">
        <Heading as="h1" mb="2rem">
          Racks Project Manager
        </Heading>
        {user.role === "admin" && (
          <Button
            onClick={handleDisplayCreateProject}
            mb="3rem"
            mr="1rem"
            variant="outline"
            colorScheme="white"
            borderRadius={"none"}
            _hover={{ bg: "white", color: "black" }}
            _active={{
              bg: "#dddfe2",
              transform: "scale(1.05)",
            }}
          >
            Create Project
          </Button>
        )}
        <Text fontSize={"1rem"}>Projects...</Text>
      </Container>
      <CreateProjectComponent
        isOpen={isOpenCreateProjectComponent}
        setIsOpen={setIsOpenCreateProjectComponent}
      />
    </>
  );
}

export default Projects;
