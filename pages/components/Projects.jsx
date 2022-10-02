import {
  Container,
  Text,
  Heading,
  Box,
  Button,
  Grid,
  GridItem,
  VStack,
  Flex,
  Spacer,
  Badge,
  Center,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Image,
  HStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import CreateProjectComponent from "./CreateProjectComponent";
import UpdateProjectComponent from "./UpdateProjectComponent";
import ShowProjectComponent from "./ShowProjectComponent";
import ShowContributorComponent from "./ShowContributorComponent";
import { getMRCImageUrlFromAvatar } from "../helpers/MRCImages";
import { formatDate } from "../helpers/FormatDate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Projects() {
  const user = useSelector(selectUserInfo);
  const [isOpenCreateProjectComponent, setIsOpenCreateProjectComponent] =
    useState(false);
  const [isOpenUpdateProjectComponent, setIsOpenUpdateProjectComponent] =
    useState(false);
  const [isOpenShowProjectComponent, setIsOpenShowProjectComponent] =
    useState(false);
  const [isOpenShowContributorComponent, setIsOpenShowContributorComponent] =
    useState(false);
  const [isOpenProjectPopover, setIsOpenProjectPopover] = useState(false);
  const [isOpenBlockedPopover, setIsOpenBlockedPopover] = useState(false);
  const [projects, setProjects] = useState([]);
  const [contrImages, setContrImages] = useState(null);
  const [projectToUpdate, setProjectToUpdate] = useState({});
  const [projectToShow, setProjectToShow] = useState({});
  const [contributorToShow, setContributorToShow] = useState({});
  const status = {
    created: "CREATED",
    doing: "DOING",
    finished: "FINISHED",
  };

  const compareContributors = (contr1, contr2) => {
    return contr1.reputationLevel - contr2.reputationLevel;
  };

  const handleDisplayCreateProject = () => {
    if (user.role === "admin") {
      setIsOpenCreateProjectComponent(true);
    }
  };

  const handleShowContributorOpen = async (event, id) => {
    if (id && event.target.alt === "PFP") {
      const res = await fetch(API_URL + "users/id/" + id, {
        method: "get",
        headers: new Headers({
          Authorization: localStorage.getItem("token"),
        }),
      });
      if (res?.ok) {
        const data = await res.json();
        data.createdAt = formatDate(data.createdAt);
        setContributorToShow(data);
        setIsOpenShowContributorComponent(true);
      }
    }
  };

  const handleProjectClick = (event, project) => {
    if (event.target.alt === "PFP") return;
    if (user.role === "admin") {
      setProjectToUpdate(project);
      setIsOpenUpdateProjectComponent(true);
    } else {
      const userIsProjectContributor =
        project.contributors.indexOf(user._id) > -1;
      if (user.contributor && user.verified) {
        if (project.completed && !userIsProjectContributor) {
          setIsOpenBlockedPopover(true);
        } else {
          setProjectToShow(project);
          setIsOpenShowProjectComponent(true);
        }
      } else {
        setIsOpenProjectPopover(true);
      }
    }
  };

  const onCloseProjectPopover = () => {
    setIsOpenProjectPopover(false);
  };

  const onCloseBlockedPopover = () => {
    setIsOpenBlockedPopover(false);
  };

  const getMRCImageUrlFromContributor = async (id) => {
    if (id) {
      const res = await fetch(API_URL + "users/id/" + id, {
        method: "get",
        headers: new Headers({
          Authorization: localStorage.getItem("token"),
        }),
      });
      if (res?.ok) {
        const data = await res.json();
        const mrc = await getMRCImageUrlFromAvatar(data.avatar);
        return mrc;
      }
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

      const imgsMap = new Map();
      for (const project of data) {
        project.createdAt = formatDate(project.createdAt);
        if (project.completed) {
          project.completedAt = formatDate(project.completedAt);
        }
        if (project.contributors.length > 4)
          project.contributors = project.contributors.slice(0, 4);

        for (const contr of project.contributors) {
          if (!imgsMap.get(project.address))
            imgsMap.set(project.address, new Map());
          imgsMap
            .get(project.address)
            .set(contr, await getMRCImageUrlFromContributor(contr));
        }
      }
      setProjects(data);
      setContrImages(imgsMap);

      return data.length;
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
        mt="-1rem"
        mb={user.role === "admin" ? "-1.2rem" : "0"}
      >
        <Popover isOpen={isOpenProjectPopover} onClose={onCloseProjectPopover}>
          <PopoverTrigger>
            <Heading as="h1" mb="2rem">
              Racks Project Manager
            </Heading>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Se un Contributor!</PopoverHeader>
            <PopoverBody>
              Para participar en un proyecto antes debe registrarse como
              Contributor.
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {user.role === "admin" && (
          <Button
            onClick={handleDisplayCreateProject}
            mb="1rem"
            mr="1rem"
            variant="outline"
            colorScheme="white"
            borderRadius={"none"}
            _hover={{ bg: "white", color: "black" }}
          >
            Create Project
          </Button>
        )}
        {projects.length != 0 ? (
          <Popover
            isOpen={isOpenBlockedPopover}
            onClose={onCloseBlockedPopover}
          >
            <PopoverTrigger>
              <Grid templateColumns="repeat(4, 1fr)" pb="5">
                {projects.map((p) => (
                  <Box
                    p="6"
                    pt="3"
                    pb="2"
                    key={p.address}
                    onClick={(event) => handleProjectClick(event, p)}
                  >
                    <Box
                      w="17rem"
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor="#555"
                      overflow="hidden"
                      style={{ cursor: "pointer" }}
                    >
                      <Box p="6" pb="3">
                        <Box>
                          <Center>
                            <Image
                              w="150px"
                              h="70px"
                              objectFit="contain"
                              src={p.imageURL}
                              alt="Project img"
                            />
                          </Center>
                        </Box>
                        <Box
                          mt="3"
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
                          style={{ borderColor: "#FEFE0E" }}
                        />
                        <Flex mt="6px" mb="3px" pr="1">
                          <Center>
                            <Box>
                              {p.status === status.created && (
                                <Badge
                                  borderRadius="full"
                                  px="2"
                                  colorScheme="green"
                                >
                                  NEW
                                </Badge>
                              )}
                              {p.status === status.doing && (
                                <Badge
                                  borderRadius="full"
                                  px="2"
                                  colorScheme="yellow"
                                >
                                  DEV
                                </Badge>
                              )}
                              {p.status === status.finished && (
                                <Badge borderRadius="full" colorScheme="red">
                                  COMPLETED
                                </Badge>
                              )}
                            </Box>
                          </Center>
                          <Spacer />
                          <Center>
                            <HStack>
                              {p.contributors.map((contr) => (
                                <Box key={contr}>
                                  {contrImages ? (
                                    <>
                                      <Image
                                        src={contrImages
                                          .get(p.address)
                                          .get(contr)}
                                        onClick={(event) =>
                                          handleShowContributorOpen(
                                            event,
                                            contr
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                        borderRadius="full"
                                        boxSize="30px"
                                        alt="PFP"
                                      />
                                    </>
                                  ) : (
                                    <Image
                                      src={"./fallback.gif"}
                                      onClick={() => router.push("/profile")}
                                      style={{ cursor: "pointer" }}
                                      borderRadius="full"
                                      boxSize="50px"
                                      alt="PFP"
                                    />
                                  )}
                                </Box>
                              ))}
                            </HStack>
                          </Center>
                        </Flex>
                        <VStack alignItems="baseline">
                          <Box fontSize={"0.85rem"}>
                            <Center>{p.requirements}</Center>
                          </Box>

                          <Grid templateColumns="repeat(3, 1fr)">
                            <GridItem
                              color="gray.500"
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              textTransform="uppercase"
                              colSpan={2}
                            >
                              <Text color="gray">Reputation</Text>
                            </GridItem>
                            <GridItem
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              ml="3rem"
                              colSpan={1}
                            >
                              {p.reputationLevel}
                            </GridItem>
                            <GridItem
                              color="gray.500"
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              textTransform="uppercase"
                              mt="1"
                              colSpan={2}
                            >
                              <Text color="gray">Colateral (USDC)</Text>
                            </GridItem>
                            <GridItem
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              ml="3rem"
                              mt="1"
                              colSpan={1}
                            >
                              {p.colateralCost}
                            </GridItem>
                            <GridItem
                              color="gray.500"
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              textTransform="uppercase"
                              mt="1"
                              colSpan={2}
                            >
                              <Text color="gray">N.Contributors</Text>
                            </GridItem>
                            <GridItem
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              ml="3rem"
                              mt="1"
                              colSpan={1}
                            >
                              {p.contributors.length +
                                "/" +
                                p.maxContributorsNumber}
                            </GridItem>
                            {p.completed ? (
                              <>
                                <GridItem
                                  color="gray.500"
                                  fontWeight="semibold"
                                  letterSpacing="wide"
                                  fontSize="xs"
                                  textTransform="uppercase"
                                  mt="1"
                                  colSpan={2}
                                >
                                  <Text color="gray">Completado el:</Text>
                                </GridItem>
                                <GridItem
                                  fontWeight="semibold"
                                  letterSpacing="wide"
                                  fontSize="xs"
                                  mt="1"
                                  colSpan={1}
                                >
                                  {p.completedAt}
                                </GridItem>
                              </>
                            ) : (
                              <>
                                <GridItem
                                  color="gray.500"
                                  fontWeight="semibold"
                                  letterSpacing="wide"
                                  fontSize="xs"
                                  textTransform="uppercase"
                                  mt="1"
                                  colSpan={2}
                                >
                                  <Text color="gray">Creado el:</Text>
                                </GridItem>
                                <GridItem
                                  fontWeight="semibold"
                                  letterSpacing="wide"
                                  fontSize="xs"
                                  mt="1"
                                  colSpan={1}
                                >
                                  {p.createdAt}
                                </GridItem>
                              </>
                            )}
                          </Grid>
                        </VStack>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader borderColor="red">No disponible</PopoverHeader>
              <PopoverBody>
                El Proyecto no admite nuevos Contributors.
              </PopoverBody>
            </PopoverContent>
          </Popover>
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
      <ShowProjectComponent
        isOpen={isOpenShowProjectComponent}
        setIsOpen={setIsOpenShowProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToShow}
      />
      <ShowContributorComponent
        isOpen={isOpenShowContributorComponent}
        setIsOpen={setIsOpenShowContributorComponent}
        contributor={contributorToShow}
      />
    </>
  );
}

export default Projects;
