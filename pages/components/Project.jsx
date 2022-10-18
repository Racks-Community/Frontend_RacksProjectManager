import {
  Text,
  Box,
  Grid,
  GridItem,
  VStack,
  Flex,
  Spacer,
  Badge,
  Center,
  Divider,
  Image,
  HStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ShowContributorComponent from "./ShowContributorComponent";
import { ObjectIsNotEmpty } from "../helpers/ObjectIsNotEmpty";
import { getMRCImageUrlFromAvatar } from "../helpers/MRCImages";
import { formatDate } from "../helpers/FormatDate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Project = ({ project, handleProjectClick, privateProject }) => {
  const [isOpenShowContributorComponent, setIsOpenShowContributorComponent] =
    useState(false);
  const [contributorToShow, setContributorToShow] = useState({});
  const [contrImages, setContrImages] = useState(null);
  const status = {
    created: "CREATED",

    doing: "DOING",
    finished: "FINISHED",
  };
  const approveStatus = {
    pending: "PENDING",
    active: "ACTIVE",
    rejected: "REJECTED",
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
        if (project.completed) data.createdAt = formatDate(data.createdAt);
        data.createdAt = formatDate(data.createdAt);
        setContributorToShow(data);
        setIsOpenShowContributorComponent(true);
      }
    }
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

  const fetchMRCImagesFromProject = async () => {
    const imgsMap = new Map();

    if (project.contributors.length > 4)
      project.contributors = project.contributors.slice(0, 4);

    for (const contr of project.contributors) {
      if (!imgsMap.get(project.address))
        imgsMap.set(project.address, new Map());
      imgsMap
        .get(project.address)
        .set(contr, await getMRCImageUrlFromContributor(contr));
    }

    setContrImages(imgsMap);
  };

  useEffect(() => {
    if (ObjectIsNotEmpty(project)) fetchMRCImagesFromProject();
  }, [project]);

  return (
    <>
      <Box p="6" pt="3" pb="2">
        <Box
          w="17rem"
          borderWidth="1px"
          borderRadius="lg"
          borderColor="#555"
          className="project-box"
          onClick={(event) => handleProjectClick(event, project)}
        >
          <Box p="6" pb="3">
            <Box>
              <Center>
                <Image
                  w="150px"
                  h="70px"
                  objectFit="contain"
                  src={project.imageURL}
                  alt="Project img"
                />
              </Center>
            </Box>
            <Box mt="3" ml="1" fontWeight="semibold" as="h4" lineHeight="tight">
              <Center>{project.name}</Center>
            </Box>

            <Divider w={"95%"} mx={"auto"} style={{ borderColor: "#FEFE0E" }} />
            <Flex mt="6px" mb="3px" pr="1">
              <Center>
                {privateProject && project.status === status.created ? (
                  <Box>
                    {project.approveStatus === approveStatus.pending && (
                      <Badge borderRadius="full" px="2" colorScheme="orange">
                        PENDING
                      </Badge>
                    )}
                    {project.approveStatus === approveStatus.active && (
                      <Badge borderRadius="full" px="2" colorScheme="green">
                        ACTIVE
                      </Badge>
                    )}
                    {project.approveStatus === approveStatus.rejected && (
                      <Badge borderRadius="full" colorScheme="red">
                        REJECTED
                      </Badge>
                    )}
                  </Box>
                ) : (
                  <Box>
                    {project.status === status.created && (
                      <Badge borderRadius="full" px="2" colorScheme="green">
                        NEW
                      </Badge>
                    )}
                    {project.status === status.doing && (
                      <Badge borderRadius="full" px="2" colorScheme="yellow">
                        DEV
                      </Badge>
                    )}
                    {project.status === status.finished && (
                      <Badge borderRadius="full" colorScheme="red">
                        COMPLETED
                      </Badge>
                    )}
                  </Box>
                )}
              </Center>
              <Spacer />
              <Center>
                <HStack>
                  {project.contributors.map((contr) => (
                    <Box key={contr}>
                      {contrImages ? (
                        <>
                          <Image
                            src={contrImages.get(project.address).get(contr)}
                            onClick={(event) =>
                              handleShowContributorOpen(event, contr)
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
                <Center>
                  <Text noOfLines={2}>
                    {project.requirements}
                    {project.requirements.length < 32 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </Text>
                </Center>
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
                  <Text color="gray">LV Reputación</Text>
                </GridItem>
                <GridItem
                  fontWeight="semibold"
                  letterSpacing="wide"
                  fontSize="xs"
                  ml="3rem"
                  colSpan={1}
                >
                  {project.reputationLevel}
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
                  {project.colateralCost}
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
                  {project.contributors.length +
                    "/" +
                    project.maxContributorsNumber}
                </GridItem>
                {project.completed ? (
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
                      {project.completedAt.length <= 10 && project.completedAt}
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
                      {project.createdAt.length <= 10 && project.createdAt}
                    </GridItem>
                  </>
                )}
              </Grid>
            </VStack>
          </Box>
        </Box>
      </Box>
      <ShowContributorComponent
        isOpen={isOpenShowContributorComponent}
        setIsOpen={setIsOpenShowContributorComponent}
        contributor={contributorToShow}
      />
    </>
  );
};

export default Project;
