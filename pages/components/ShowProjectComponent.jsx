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
  Badge,
  Grid,
  GridItem,
  Center,
  Link,
} from "@chakra-ui/react";
import toast from "./Toast";
import { formatDate } from "../helpers/FormatDate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const ShowProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
}) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const [userIsProjectCtr, setUserIsProjectCtr] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);
  const status = {
    created: "CREATED",
    doing: "DOING",
    finished: "FINISHED",
  };

  const handleJoinProjectClick = async () => {
    if (user.role === "user" && project.address) {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const racksPM = new ethers.Contract(
        contractAddresses[CHAIN_ID].RacksProjectManager[0],
        RacksPmAbi,
        signer
      );
      const mockErc20 = new ethers.Contract(
        contractAddresses[CHAIN_ID].MockErc20[0],
        MockErc20Abi,
        signer
      );
      try {
        const isContributor = await racksPM.isWalletContributor(user.address);
        if (!isContributor) {
          notify("error", "Necesitas ser Contributor");
          setIsOpen(false);
          setLoading(false);
          return;
        }

        let erctx = await mockErc20.approve(
          project.address,
          project.colateralCost
        );
        await erctx.wait();

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
          notify("success", "Se ha unido a un nuevo Proyecto!");
        }
      } catch (error) {
        notify("error", "Error al unirse al Proyecto");
      }

      setIsOpen(false);
      setLoading(false);
    }
  };

  const isProjectContributor = () => {
    if (!project.address) return false;
    const userIsProjectContributor =
      project.contributors.indexOf(user._id) > -1;
    return userIsProjectContributor;
  };

  useEffect(() => {
    setUserIsProjectCtr(isProjectContributor());
  }, [project]);

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      {userIsProjectCtr == true ? (
        <ModalContent>
          <ModalHeader className="text-center">
            DETALLES DEL PROYECTO
          </ModalHeader>
          <ModalCloseButton colorScheme="white" />
          <ModalBody pb={6}>
            <Box p="4">
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

                <Box fontSize={"0.85rem"}>
                  <Center>{project.description}</Center>
                </Box>

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
                  <Center>{project.requirements}</Center>
                </Box>

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

                <Grid templateColumns="repeat(4, 1fr)">
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
                    <Text color="gray">N.Contributors</Text>
                  </GridItem>
                  <GridItem
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
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
            <Button
              onClick={() => setIsOpen(false)}
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              _hover={{ bg: "#dddfe236" }}
              size="sm"
              mt={-5}
              mb={1}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : (
        <ModalContent>
          <ModalHeader className="text-center">UNIRSE AL PROYECTO</ModalHeader>
          <ModalCloseButton colorScheme="white" />
          <ModalBody pb={6} fontSize={"0.85rem"}>
            <Text>
              Para participar en este proyecto debes transferir
              {" " + project.colateralCost} USDC como fianza.
            </Text>
            <br />
            <Text>Esta será devuelta al finalizar el proyecto.</Text>
            <Text>
              Se perderá el derecho a devolución del colateral si se filtra
              información del proyecto o realiza cualquier acción grave que
              perjudique o cause daños al desarrollo del proyecto.
            </Text>
            <br />
            <Text>¿Está seguro de querer unirse a este proyecto?</Text>
          </ModalBody>

          <ModalFooter>
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
              mt={-5}
              mb={1}
            >
              Unirme
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              _hover={{ bg: "#dddfe236" }}
              size="sm"
              mt={-5}
              mb={1}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default ShowProjectComponent;
