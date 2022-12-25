import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import {
  contractAddresses,
  ProjectAbi,
  RacksPmAbi,
  MockErc20Abi,
} from "../../web3Constants";
import { ethers } from "ethers";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Divider,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Center,
  Link,
  Image,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { ObjectIsNotEmpty } from "../../helpers/ObjectIsNotEmpty";
import FundProjectComponent from "./FundProjectComponent";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const ShowProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
  clearProject,
}) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const [projectToFund, setProjectToFund] = useState({});
  const [openJoinProject, setOpenJoinProject] = useState(false);
  const [openFundProject, setOpenFundProject] = useState(false);
  const [isProjectContributor, setIsProjectContributor] = useState(false);
  const [errorCodeJoinProject, setErrorCodeJoinProject] = useState("NONE");

  const status = {
    created: "CREATED",
    doing: "DOING",
    finished: "FINISHED",
  };
  const errorCode = {
    completed: "PROJECT_COMPLETED",
    reputation: "NO_ENOUGH_REPUTATION",
    no_github: "NO_GITHUB_ACCOUNT",
    full: "PROJECT_FULL",
    contributor: "NO_CONTRIBUTOR",
    none: "NONE",
  };

  const handleJoinProjectClick = async () => {
    if (
      user.role === "user" &&
      project.address &&
      user.reputationLevel >= project.reputationLevel
    ) {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const racksPM = new ethers.Contract(
        contractAddresses[CHAIN_ID].RacksProjectManager,
        RacksPmAbi,
        signer
      );
      const mockErc20 = new ethers.Contract(
        contractAddresses[CHAIN_ID].MockErc20,
        MockErc20Abi,
        signer
      );
      try {
        const isContributor = await racksPM.isWalletContributor(user.address);
        if (!isContributor) {
          toast.error("Necesitas ser Miembro");
          setIsOpen(false);
          setLoading(false);
          return;
        }

        if (project.colateralCost > 0) {
          let erctx = await mockErc20.approve(
            project.address,
            ethers.utils.parseEther(project.colateralCost + "")
          );
          await erctx.wait();
        }

        const projectContract = new ethers.Contract(
          project.address,
          ProjectAbi,
          signer
        );

        let tx = await projectContract.registerProjectContributor();
        await tx.wait();
        if (tx.hash) {
          await fetch(API_URL + "projects/add-contributor/" + project.address, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ contributorAddress: user.address }),
          });
          setTimeout(async () => {
            await fetchProjects();
          }, 1500);
          toast.success("Se ha unido a un nuevo Proyecto!");
        }
      } catch (error) {
        toast.error("Error al unirse al Proyecto");
      }

      setLoading(false);
      handleCloseShowProject();
    } else {
      toast.error("Reputación Insuficiente");
      handleCloseShowProject();
    }
  };

  const handleCloseShowProject = () => {
    setOpenJoinProject(false);
    setErrorCodeJoinProject(errorCode.none);
    clearProject();
    setIsOpen(false);
  };

  const handleOpenFundProjectComponent = () => {
    setOpenJoinProject(false);
    setErrorCodeJoinProject(errorCode.none);
    setIsOpen(false);
    setOpenFundProject(true);
  };

  const checkProjectContributor = () => {
    if (!project.address) return false;
    const userIsProjectContributor =
      project.contributors.indexOf(user._id) > -1 || user.role === "admin";
    return userIsProjectContributor;
  };

  useEffect(() => {
    if (ObjectIsNotEmpty(project)) {
      setIsProjectContributor(checkProjectContributor());
      setProjectToFund(project);
      if (project.completed) setErrorCodeJoinProject(errorCode.completed);
      else if (!user.contributor || (user.contributor && !user.verified))
        setErrorCodeJoinProject(errorCode.contributor);
      else if (user.githubUsername === "undefined" && project.isProgramming)
        setErrorCodeJoinProject(errorCode.no_github);
      else if (project.reputationLevel > user.reputationLevel)
        setErrorCodeJoinProject(errorCode.reputation);
      else if (project.maxContributorsNumber == project.contributors.length)
        setErrorCodeJoinProject(errorCode.full);
    }
  }, [project, user]);

  if (ObjectIsNotEmpty(project)) {
    return (
      <>
        <Modal
          isCentered
          autoFocus={false}
          isOpen={isOpen}
          onClose={handleCloseShowProject}
          destroyOnClose={true}
        >
          <ModalOverlay />
          {!openJoinProject && ObjectIsNotEmpty(project) ? (
            <ModalContent
              className={
                isProjectContributor && project.details
                  ? "show-project-modal"
                  : ""
              }
            >
              <ModalHeader className="text-center">
                DETALLES DEL PROYECTO
              </ModalHeader>
              <ModalCloseButton colorScheme="white" />
              <ModalBody>
                <Box p="4" pt="0" mt="-4">
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
                    mt="1"
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
                    mt="2"
                    mb="1rem"
                    style={{ borderColor: "#FEFE0E" }}
                  />
                  <VStack alignItems="baseline">
                    <HStack>
                      {project.status === status.created && (
                        <Badge borderRadius="full" px="2" colorScheme="green">
                          NEW
                        </Badge>
                      )}
                      {project.status === status.doing && (
                        <Badge borderRadius="full" px="2" colorScheme="yellow">
                          IN DEVELOPMENT
                        </Badge>
                      )}
                      {project.status === status.finished && (
                        <Badge borderRadius="full" px="2" colorScheme="red">
                          COMPLETED
                        </Badge>
                      )}
                      {!project.isProgramming && (
                        <Badge borderRadius="full" px="2" colorScheme="gray">
                          NO PROGRAMMING
                        </Badge>
                      )}
                    </HStack>

                    <Box fontSize={"0.85rem"}>
                      <Text
                        color="gray"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                      >
                        Requerimientos:
                      </Text>
                      <Text>{project.requirements}</Text>
                    </Box>

                    <Box fontSize={"0.85rem"}>
                      <Center>{project.description}</Center>
                    </Box>

                    {isProjectContributor && (
                      <>
                        {project.details && (
                          <Box fontSize={"0.85rem"}>
                            <Text
                              color="gray"
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              textTransform="uppercase"
                            >
                              Detalles:
                            </Text>
                            <Text>{project.details}</Text>
                          </Box>
                        )}

                        {project.githubRepository && (
                          <Box fontSize={"0.85rem"}>
                            <Text
                              color="gray"
                              fontWeight="semibold"
                              letterSpacing="wide"
                              fontSize="xs"
                              textTransform="uppercase"
                            >
                              Github Repository:
                            </Text>
                            <Center>
                              <Link href="project.githubRepository" isExternal>
                                {project.githubRepository}
                              </Link>
                            </Center>
                          </Box>
                        )}

                        <Box fontSize={"0.85rem"}>
                          <Text
                            color="gray"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                          >
                            Address:
                          </Text>
                          <Center>
                            <Link
                              href={
                                "https://goerli.etherscan.io/address/" +
                                project.address
                              }
                              isExternal
                            >
                              {project.address}
                            </Link>
                          </Center>
                        </Box>
                      </>
                    )}

                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      w={"100%"}
                      className="show-project-grid"
                    >
                      <GridItem
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        colSpan={3}
                      >
                        <Text color="gray">Reputation</Text>
                      </GridItem>
                      <GridItem
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        colSpan={1}
                        textAlign={"end"}
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
                        colSpan={3}
                      >
                        <Text color="gray">Colateral (USDC)</Text>
                      </GridItem>
                      <GridItem
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        mt="1"
                        colSpan={1}
                        textAlign={"end"}
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
                        colSpan={3}
                      >
                        <Text color="gray">N.Miembros</Text>
                      </GridItem>
                      <GridItem
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        mt="1"
                        colSpan={1}
                        textAlign={"end"}
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
                        colSpan={3}
                      >
                        <Text color="gray">Fondos</Text>
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
                      {project.funds > 0 && (
                        <>
                          <GridItem
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            mt="1"
                            colSpan={3}
                          >
                            <Text color="gray">Fondos:</Text>
                          </GridItem>
                          <GridItem
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            mt="1"
                            colSpan={1}
                            textAlign={"end"}
                          >
                            {project.funds + " USDC"}
                          </GridItem>
                        </>
                      )}
                      {project.completed ? (
                        <>
                          <GridItem
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            mt="1"
                            colSpan={3}
                          >
                            <Text color="gray">Completado el:</Text>
                          </GridItem>
                          <GridItem
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            mt="1"
                            colSpan={1}
                            textAlign={"end"}
                          >
                            {project.completedAt}
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
                            colSpan={3}
                          >
                            <Text color="gray">Creado el:</Text>
                          </GridItem>
                          <GridItem
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            mt="1"
                            colSpan={1}
                            textAlign={"end"}
                          >
                            {project.createdAt}
                          </GridItem>
                        </>
                      )}
                    </Grid>
                  </VStack>
                </Box>
              </ModalBody>

              <ModalFooter>
                {!project.completed && project.status == "DOING" && (
                  <Button
                    onClick={handleOpenFundProjectComponent}
                    variant="outline"
                    bg="transparent"
                    borderColor={"#FEFE0E"}
                    color="white"
                    borderRadius={"none"}
                    _hover={{
                      bg: "#FEFE0E",
                      color: "black",
                      transition: "0.5s",
                    }}
                    size="sm"
                    mb={1}
                    mr={3}
                  >
                    Donar
                  </Button>
                )}

                {!project.completed && !isProjectContributor && (
                  <Button
                    onClick={() => setOpenJoinProject(true)}
                    disabled={project.completed || isProjectContributor}
                    bg="white"
                    color="black"
                    variant="solid"
                    borderRadius={"none"}
                    _hover={{
                      bg: "#dddfe2",
                    }}
                    size="sm"
                    mb={1}
                    mr={3}
                  >
                    Unirme
                  </Button>
                )}

                <Button
                  onClick={handleCloseShowProject}
                  colorScheme="white"
                  variant="outline"
                  borderRadius={"none"}
                  _hover={{ bg: "#dddfe236" }}
                  size="sm"
                  mb={1}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </ModalContent>
          ) : (
            <ModalContent>
              <ModalHeader className="text-center">
                UNIRSE AL PROYECTO
              </ModalHeader>
              <ModalCloseButton colorScheme="white" />
              <ModalBody fontSize={"0.85rem"}>
                {(errorCodeJoinProject == errorCode.completed ||
                  errorCodeJoinProject == errorCode.full) && (
                  <Center>El Proyecto no admite nuevos Miembros</Center>
                )}
                {errorCodeJoinProject == errorCode.contributor && (
                  <Center>
                    Para participar en un proyecto antes debe ser Miembro.
                  </Center>
                )}
                {errorCodeJoinProject == errorCode.no_github && (
                  <Center textAlign={"center"}>
                    Introduzca un usuario de Github válido en su perfil.
                  </Center>
                )}
                {errorCodeJoinProject == errorCode.reputation && (
                  <Center textAlign={"center"}>
                    No tiene suficiente reputación para participar en este
                    proyecto.
                  </Center>
                )}
                {errorCodeJoinProject == errorCode.none && (
                  <>
                    {project.colateralCost == 0 ? (
                      <Center textAlign={"center"}>
                        Este proyecto no requiere de pagar ningun colateral.
                        <br />
                        Por favor no haga nada que pueda ir en contra de los
                        intereses del proyecto.
                      </Center>
                    ) : (
                      <>
                        <Text>
                          Para participar en este proyecto debes transferir
                          {" " + project.colateralCost} USDC como fianza.
                        </Text>
                        <br />
                        <Text>
                          Esta será devuelta al finalizar el proyecto.
                        </Text>
                        <Text>
                          Se perderá el derecho a devolución del colateral si se
                          filtra información del proyecto o realiza cualquier
                          acción grave que perjudique o cause daños al
                          desarrollo del proyecto.
                        </Text>
                        <br />
                        <Text>
                          ¿Está seguro de querer unirse a este proyecto?
                        </Text>
                      </>
                    )}
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                {errorCodeJoinProject === errorCode.none && (
                  <Button
                    onClick={() => handleJoinProjectClick()}
                    isLoading={loading}
                    loadingText="Unirme"
                    bg="white"
                    color="black"
                    variant="solid"
                    borderRadius={"none"}
                    _hover={{
                      bg: "#dddfe2",
                    }}
                    size="sm"
                    mr={3}
                    mb={1}
                  >
                    Unirme
                  </Button>
                )}
                <Button
                  onClick={handleCloseShowProject}
                  colorScheme="white"
                  variant="outline"
                  borderRadius={"none"}
                  _hover={{ bg: "#dddfe236" }}
                  size="sm"
                  mb={1}
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
        <FundProjectComponent
          isOpen={openFundProject}
          setIsOpen={setOpenFundProject}
          fetchProjects={fetchProjects}
          project={projectToFund}
        />
      </>
    );
  } else {
    return <></>;
  }
};

export default ShowProjectComponent;
