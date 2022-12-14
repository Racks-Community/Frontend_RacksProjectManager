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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ShowContributorComponent from "./ShowContributorComponent";
import { ObjectIsNotEmpty } from "../../helpers/ObjectIsNotEmpty";
import { getMRCImageUrlFromContributor } from "../../helpers/MRCImages";
import { formatDate } from "../../helpers/FormatDate";
import { FaPlus } from "react-icons/fa";
import { getUserById } from "../../helpers/APICalls";

const Project = ({ project, admin, handleProjectClick, privateProject }) => {
  const [isOpenShowContributorComponent, setIsOpenShowContributorComponent] =
    useState(false);
  const [isOpenContributorsPopover, setIsOpenContributorsPopover] =
    useState(false);

  const [contributorToShow, setContributorToShow] = useState({});
  const [contrImages, setContrImages] = useState(null);
  const [contrArrayReduced, setContrArrayReduced] = useState([]);

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

  const onCloseContributorsPopover = () => {
    setIsOpenContributorsPopover(false);
  };

  const checkProjectContributor = (contr) => {
    if (!project.address) return false;
    const userIsProjectContributor = project.contributors.indexOf(contr) > -1;
    return userIsProjectContributor;
  };

  const handleShowContributorOpen = async (event, id, participationWeight) => {
    if (id && id != admin && event.target.alt === "PFP") {
      const data = await getUserById(id, localStorage.getItem("token"));
      data.createdAt = formatDate(data.createdAt);
      data.isOwner = project.owner == id;
      data.isContributor = checkProjectContributor(id);
      if (participationWeight > 0)
        data.participationWeight = participationWeight;
      setContributorToShow(data);
      setIsOpenShowContributorComponent(true);
    }
  };

  const fetchMRCImagesFromProject = async () => {
    const imgsMap = new Map();
    const arrayWithOwner = [];
    arrayWithOwner.push(...project.contributors);
    if (arrayWithOwner[0] !== project.owner) {
      arrayWithOwner.unshift(project.owner);
      arrayWithOwner = [...new Set(arrayWithOwner)];
    }
    const contributors = arrayWithOwner.slice(0, 3);
    for (const contr of arrayWithOwner) {
      if (!imgsMap.get(project.address))
        imgsMap.set(project.address, new Map());
      imgsMap
        .get(project.address)
        .set(
          contr,
          await getMRCImageUrlFromContributor(
            contr,
            localStorage.getItem("token")
          )
        );
    }
    contributors.reverse();
    arrayWithOwner.reverse();
    arrayWithOwner.length > 3
      ? setContrArrayReduced(contributors)
      : setContrArrayReduced(arrayWithOwner);
    setContrImages(imgsMap);
  };

  useEffect(() => {
    if (ObjectIsNotEmpty(project)) fetchMRCImagesFromProject();
  }, [project]);

  if (ObjectIsNotEmpty(project)) {
    return (
      <>
        <Popover
          isOpen={isOpenContributorsPopover}
          onClose={onCloseContributorsPopover}
          autoFocus={false}
        >
          <PopoverTrigger>
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
                  <Box
                    mt="3"
                    ml="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                  >
                    <Center>{project.name}</Center>
                  </Box>

                  <Divider
                    w={"95%"}
                    mx={"auto"}
                    style={{ borderColor: "#FEFE0E" }}
                  />
                  <Flex mt="6px" mb="3px" pr="1">
                    <Center>
                      {privateProject && project.status === status.created ? (
                        <Box>
                          {project.approveStatus === approveStatus.pending && (
                            <Badge
                              borderRadius="full"
                              px="2"
                              colorScheme="orange"
                            >
                              PENDING
                            </Badge>
                          )}
                          {project.approveStatus === approveStatus.active && (
                            <Badge
                              borderRadius="full"
                              px="2"
                              colorScheme="green"
                            >
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
                            <Badge
                              borderRadius="full"
                              px="2"
                              colorScheme="green"
                            >
                              NEW
                            </Badge>
                          )}
                          {project.status === status.doing && (
                            <Badge
                              borderRadius="full"
                              px="2"
                              colorScheme="yellow"
                            >
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
                        {project.contributors.length > 3 && (
                          <FaPlus
                            className="all-contributors"
                            onClick={() => setIsOpenContributorsPopover(true)}
                          />
                        )}
                        {contrArrayReduced.map((contr, index) => (
                          <Box key={contr}>
                            {contrImages ? (
                              <div
                                className={
                                  contr == project.owner ? "ownerPFP" : ""
                                }
                              >
                                <Image
                                  src={contrImages
                                    .get(project.address)
                                    .get(contr)}
                                  onClick={(event) =>
                                    handleShowContributorOpen(
                                      event,
                                      contr,
                                      project.completed &&
                                        project.participationWeights.length ==
                                          contrArrayReduced.length
                                        ? project.participationWeights[index]
                                        : 0
                                    )
                                  }
                                  className={
                                    contr == admin
                                      ? "racksPFP"
                                      : "contributorPFP"
                                  }
                                  boxSize="30px"
                                  alt="PFP"
                                />
                              </div>
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

                    <Grid templateColumns="repeat(3, 1fr)" w={"100%"}>
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
                        textAlign={"end"}
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
                        textAlign={"end"}
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
                        textAlign={"end"}
                        mt="1"
                        colSpan={1}
                      >
                        {project.contributors.length +
                          "/" +
                          project.maxContributorsNumber}
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
                        <Text color="gray">Fondos:</Text>
                      </GridItem>
                      <GridItem
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        mt="1"
                        textAlign={"end"}
                        colSpan={1}
                      >
                        {project.funds + " USDC"}
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
                            textAlign={"end"}
                            colSpan={1}
                          >
                            {project.completedAt.length <= 10 &&
                              project.completedAt}
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
                            textAlign={"end"}
                            colSpan={1}
                          >
                            {project.createdAt.length <= 10 &&
                              project.createdAt}
                          </GridItem>
                        </>
                      )}
                    </Grid>
                  </VStack>
                </Box>
              </Box>
            </Box>
          </PopoverTrigger>
          <PopoverContent className="popover-contributors">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader borderColor="yellow">
              <Center>Contributors</Center>
            </PopoverHeader>
            <PopoverBody>
              <Center>
                <Flex wrap>
                  {project.contributors.map((contr) => (
                    <Box key={contr}>
                      {contrImages ? (
                        <>
                          <Image
                            src={contrImages.get(project.address).get(contr)}
                            onClick={(event) =>
                              handleShowContributorOpen(
                                event,
                                contr,
                                project.completed
                                  ? project.participationWeights[index]
                                  : 0
                              )
                            }
                            style={{ cursor: "pointer" }}
                            borderRadius="full"
                            boxSize="50px"
                            mx="4px"
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
                </Flex>
              </Center>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <ShowContributorComponent
          isOpen={isOpenShowContributorComponent}
          setIsOpen={setIsOpenShowContributorComponent}
          contributor={contributorToShow}
        />
      </>
    );
  } else {
    return <></>;
  }
};

export default Project;
