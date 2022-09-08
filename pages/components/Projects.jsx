import {
  Container,
  Text,
  Heading,
  Box,
  Button,
  Grid,
  VStack,
  Badge,
  Center,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import CreateProjectComponent from "./CreateProjectComponent";
import UpdateProjectComponent from "./UpdateProjectComponent";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Projects() {
  const user = useSelector(selectUserInfo);
  const [isOpenCreateProjectComponent, setIsOpenCreateProjectComponent] =
    useState(false);
  const [isOpenUpdateProjectComponent, setIsOpenUpdateProjectComponent] =
    useState(false);
  const [projects, setProjects] = useState([]);
  const [projectToUpdate, setProjectToUpdate] = useState({});
  const status = {
    created: "CREATED",
    doing: "DOING",
    finished: "FINISHED",
  };

  const handleDisplayCreateProject = () => {
    if (user.role === "admin") {
      setIsOpenCreateProjectComponent(true);
    }
  };

  const handleProjectClick = (project) => {
    if (user.role === "admin") {
      setProjectToUpdate(project);
      setIsOpenUpdateProjectComponent(true);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch(API_URL + "projects", {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      setProjects(data);
      return projects.length;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, []);

  return (
    <>
      <Container
        className="flex flex-col items-center projects-container"
        mt={"-1rem"}
      >
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
        {projects.length != 0 ? (
          <Grid templateColumns="repeat(4, 1fr)">
            {projects.map((p) => (
              <Box p="6" key={p.address} onClick={() => handleProjectClick(p)}>
                <Box
                  w="15rem"
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="#555"
                  overflow="hidden"
                  style={{ cursor: "pointer" }}
                >
                  <Box p="6">
                    <Box
                      mt="1"
                      ml="1"
                      fontWeight="semibold"
                      as="h4"
                      lineHeight="tight"
                    >
                      <Center>{p.name}</Center>
                    </Box>
                    <Divider
                      w={"95%"}
                      mx={"auto"}
                      mt="2"
                      mb="1rem"
                      style={{ borderColor: "#FEFE0E" }}
                    />
                    <VStack alignItems="baseline">
                      {p.status === status.created && (
                        <Badge borderRadius="full" px="2" colorScheme="green">
                          NEW
                        </Badge>
                      )}
                      {p.status === status.doing && (
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                          IN DEVELOPMENT
                        </Badge>
                      )}
                      {p.status === status.finished && (
                        <Badge borderRadius="full" px="2" colorScheme="red">
                          COMPLETED
                        </Badge>
                      )}

                      <Grid templateColumns="repeat(2, 1fr)">
                        <Box
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          textTransform="uppercase"
                        >
                          <Text color="gray">Reputation</Text>
                        </Box>
                        <Box
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          ml="3rem"
                        >
                          {p.reputationLevel}
                        </Box>
                        <Box
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          textTransform="uppercase"
                          mt="1"
                        >
                          <Text color="gray">Colateral</Text>
                        </Box>
                        <Box
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          ml="3rem"
                          mt="1"
                        >
                          {p.colateralCost}
                        </Box>
                        <Box
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          textTransform="uppercase"
                          mt="1"
                        >
                          <Text color="gray">N.Contributors</Text>
                        </Box>
                        <Box
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          ml="3rem"
                          mt="1"
                        >
                          {p.contributors.length +
                            "/" +
                            p.maxContributorsNumber}
                        </Box>
                      </Grid>
                    </VStack>
                  </Box>
                </Box>
              </Box>
            ))}
          </Grid>
        ) : (
          <Text fontSize={"1rem"} ml="-1rem">
            No Projects
          </Text>
        )}
      </Container>
      <CreateProjectComponent
        isOpen={isOpenCreateProjectComponent}
        setIsOpen={setIsOpenCreateProjectComponent}
        fetchProjects={fetchProjects}
      />
      <UpdateProjectComponent
        isOpen={isOpenUpdateProjectComponent}
        setIsOpen={setIsOpenUpdateProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToUpdate}
      />
    </>
  );
}

export default Projects;
