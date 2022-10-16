import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
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
import { FaCheck, FaTrashAlt } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ApproveProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
}) => {
  const user = useSelector(selectUserInfo);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleApproveProjectClick = async (approve) => {
    if (user.role === "admin" && project.approveStatus === "PENDING") {
      approve ? setLoadingApprove(true) : setLoadingReject(true);

      const res = await fetch(API_URL + "projects/approve/" + project.address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ approve: approve }),
      });
      if (res?.ok) {
        setTimeout(async () => {
          await fetchProjects();
        }, 1000);
        approve
          ? notify("success", "Proyecto aprobado")
          : notify("success", "Proyecto rechazado");
      } else {
        approve
          ? notify("error", "Error al aprobar el Proyecto")
          : notify("error", "Error al rechazar el Proyecto");
      }

      setIsOpen(false);
      approve ? setLoadingApprove(false) : setLoadingReject(false);
    }
  };

  return (
    <Modal
      isCentered
      autoFocus={false}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalOverlay />
      {user.role === "admin" && project.approveStatus === "PENDING" && (
        <ModalContent>
          <ModalHeader className="text-center">Aprobar PROYECTO</ModalHeader>
          <ModalCloseButton colorScheme="white" />
          <ModalBody pb={0}>
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
                <Badge borderRadius="full" px="2" colorScheme="yellow">
                  PENDING
                </Badge>

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
                  <Text>{project.requirements}</Text>
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
              onClick={() => handleApproveProjectClick(false)}
              isLoading={loadingReject}
              loadingText="Rechazar"
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              borderColor={"red"}
              _hover={{ bg: "#dddfe236" }}
              size="sm"
              mt={-3}
            >
              <FaTrashAlt style={{ color: "red" }} />
              <Text ml="1">Rechazar</Text>
            </Button>
            <Button
              onClick={() => handleApproveProjectClick(true)}
              isLoading={loadingApprove}
              loadingText="Aprobar"
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              borderColor={"#008000"}
              _hover={{ bg: "#dddfe236" }}
              size="sm"
              mt={-3}
              ml={3}
            >
              <FaCheck style={{ color: "green" }} />
              <Text ml="1">Aprobar</Text>
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              _hover={{ bg: "#dddfe236" }}
              size="sm"
              mt={-3}
              ml={3}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default ApproveProjectComponent;
