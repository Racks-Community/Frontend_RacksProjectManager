import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import { useRouter } from "next/router";
import {
  Container,
  Heading,
  Text,
  Button,
  Box,
  Center,
  Image,
  Table,
  TableContainer,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Select,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaTimesCircle,
  FaSkullCrossbones,
  FaUndo,
  FaTrashAlt,
} from "react-icons/fa";
import { getMRCImageUrlFromAvatar } from "./helpers/MRCImages";
import Loading from "./components/Loading";
import toast from "./components/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Contributors() {
  const user = useSelector(selectUserInfo);
  const router = useRouter();
  const [contributors, setContributors] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [isOpenBanPopoverId, setIsOpenBanPopoverId] = useState("");
  const [isOpenDeletePopoverId, setIsOpenDeletePopoverId] = useState("");
  const [banLoading, setBanLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [contributorProjects, setContributorProjects] = useState([]);
  const [selectedDeleteProject, setSelectedDeleteProject] = useState([]);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handlePopoverClose = () => {
    setIsOpenBanPopoverId("");
    setIsOpenDeletePopoverId("");
  };

  const handleBanPopoverOpen = (contributor) => {
    setIsOpenBanPopoverId(contributor.address);
  };
  const handleDeletePopoverOpen = async (contributor) => {
    await fetchContributorProjects(contributor);
    setIsOpenDeletePopoverId(contributor.address);
  };

  const handleDeleteContributor = async (event, contributor) => {
    event.preventDefault();
    if (user.role === "admin") {
      setDeleteLoading(true);
      const res = await fetch(
        API_URL + "projects/remove-contributor/" + event?.target[0]?.value,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ contributorAddress: contributor.address }),
        }
      );

      if (res?.ok) {
        setTimeout(async () => {
          await fetchContributors();
        }, 1000);
        notify("success", "Contributor eliminado del Proyecto");
      } else {
        notify("error", "Error al eliminar Contributor del Proyecto");
      }
      handlePopoverClose();
      setDeleteLoading(false);
    }
  };

  const handleBanContributor = async (contributor) => {
    if (user.role === "admin") {
      setBanLoading(true);
      const res = await fetch(API_URL + "users/ban/" + contributor.address, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ banned: !contributor.banned }),
      });

      if (res?.ok) {
        setTimeout(async () => {
          await fetchContributors();
        }, 1000);
        notify("success", "Contributor actualizado");
      } else {
        notify("error", "Error al actualizar Contributor");
      }
      handlePopoverClose();
      setBanLoading(false);
    }
  };

  const fetchContributorProjects = async (contributor) => {
    const res = await fetch(API_URL + "projects", {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      const result = data.filter(
        (project) =>
          project.contributors.indexOf(contributor._id) > -1 &&
          !project.completed
      );
      setContributorProjects(result);
    }
  };

  const handleOnChangeProject = (val) => {
    setSelectedDeleteProject(val);
  };

  const fetchContributors = async () => {
    if (user.role === "admin") {
      const res = await fetch(API_URL + "users", {
        method: "get",
        headers: new Headers({
          Authorization: localStorage.getItem("token"),
        }),
      });
      if (res?.ok) {
        const data = await res.json();
        if (data.length > 0) setContributors(data);
      }
    }
  };

  const fetchAvatars = async () => {
    const images = [];
    for (const contr of contributors) {
      if (contr.avatar) {
        const imageURL = await getMRCImageUrlFromAvatar(contr.avatar);
        images.push(imageURL);
      } else {
        images.push("#");
      }
    }
    setAvatars(images);
  };

  useEffect(() => {
    if (user.role === "admin") {
      fetchContributors();
    }
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    if (user.role === "admin" && contributors.length != 0) {
      fetchAvatars();
    }
  }, [contributors]);

  return (
    <>
      <Loading />
      <Container
        className="flex flex-col items-center profile-container"
        mt="-1.8rem"
        mb="3.2rem"
        maxW="95%"
        height={"100%"}
      >
        <Center>
          <Heading as="h1" mb="2rem" mt="2rem" className="rackspm-heading">
            Contributors
          </Heading>
        </Center>
        <TableContainer mt="3rem" className="contributors-table">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Avatar</Th>
                <Th>Discord</Th>
                <Th>Github</Th>
                <Th>Email</Th>
                <Th>Nivel RP</Th>
                <Th>Puntos RP</Th>
                <Th>Número Proyectos</Th>
                <Th> Activo </Th>
                <Th>
                  <Center>Acciones</Center>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {contributors.map((contr, index) => (
                <Tr key={contr.address}>
                  <Td>
                    <Image
                      borderRadius="full"
                      boxSize="50px"
                      src={avatars[index]}
                      fallbackSrc={"./fallback.gif"}
                      alt="PFP"
                    />
                  </Td>
                  <Td>{contr.discord}</Td>
                  <Td>{contr.githubUsername}</Td>
                  <Td>{contr.email}</Td>
                  <Td>
                    <Center>{contr.reputationLevel}</Center>
                  </Td>
                  <Td>
                    <Center>{contr.reputationPoints}</Center>
                  </Td>
                  <Td>
                    <Center>{contr.totalProjects}</Center>
                  </Td>
                  <Td>
                    <Center>
                      {!contr.banned ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimesCircle style={{ color: "red" }} />
                      )}
                    </Center>
                  </Td>
                  <Td>
                    <Box>
                      {!contr.banned ? (
                        <Popover
                          isOpen={isOpenBanPopoverId == contr.address}
                          onClose={handlePopoverClose}
                          placement="bottom"
                        >
                          <PopoverTrigger>
                            <Button
                              onClick={() => handleBanPopoverOpen(contr)}
                              size={"sm"}
                              bg="black"
                              color="white"
                              variant="solid"
                              borderRadius={"xl"}
                              _hover={{
                                bg: "#6d1c1c",
                              }}
                              size="sm"
                              mr={3}
                            >
                              <FaSkullCrossbones />
                              <Text ml="1">Banear</Text>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              Banear Contributor
                            </PopoverHeader>
                            <PopoverBody align="center">
                              {"¿Seguro que quiere banear a " +
                                contr.discord +
                                "?"}
                            </PopoverBody>
                            <PopoverFooter
                              border="0"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              p={4}
                              mt={3}
                            >
                              <Button
                                onClick={() => handleBanContributor(contr)}
                                size={"sm"}
                                isLoading={banLoading}
                                loadingText="Baneando"
                                bg="black"
                                color="white"
                                variant="solid"
                                borderRadius={"xl"}
                                _hover={{
                                  bg: "#6d1c1c",
                                }}
                                size="sm"
                                mr={3}
                                mt={-5}
                                mb={1}
                              >
                                Confirmar
                              </Button>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Popover
                          isOpen={isOpenBanPopoverId == contr.address}
                          onClose={handlePopoverClose}
                          placement="bottom"
                        >
                          <PopoverTrigger>
                            <Button
                              onClick={() => handleBanPopoverOpen(contr)}
                              size={"sm"}
                              bg="#444"
                              color="white"
                              variant="solid"
                              borderRadius={"xl"}
                              _hover={{
                                bg: "green",
                              }}
                              size="sm"
                              mr={3}
                            >
                              <FaUndo />
                              <Text ml="1">Unban</Text>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              Desbanear Contributor
                            </PopoverHeader>
                            <PopoverBody align="center">
                              {"¿Seguro que quiere desbanear a " +
                                contr.discord +
                                "?"}
                            </PopoverBody>
                            <PopoverFooter
                              border="0"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              p={4}
                              mt={3}
                            >
                              <Button
                                onClick={() => handleBanContributor(contr)}
                                size={"sm"}
                                isLoading={banLoading}
                                loadingText="Desbaneando"
                                bg="black"
                                color="white"
                                variant="solid"
                                borderRadius={"xl"}
                                _hover={{
                                  bg: "green",
                                }}
                                size="sm"
                                mr={3}
                                mt={-5}
                                mb={1}
                              >
                                Confirmar
                              </Button>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      )}

                      <Popover
                        isOpen={isOpenDeletePopoverId == contr.address}
                        onClose={handlePopoverClose}
                        placement="bottom"
                      >
                        <PopoverTrigger>
                          <Button
                            onClick={() => handleDeletePopoverOpen(contr)}
                            size={"sm"}
                            bg="red"
                            color="white"
                            variant="solid"
                            borderRadius={"xl"}
                            _hover={{
                              bg: "#6d1c1c",
                            }}
                            size="sm"
                          >
                            <FaTrashAlt />
                            <Text ml="1">Eliminar</Text>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            Eliminar Contributor
                          </PopoverHeader>
                          <PopoverBody align="center">
                            {contributorProjects.length == 0 ? (
                              <>
                                <Text mt="2">
                                  {contr.discord + " no tiene proyectos."}
                                </Text>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  mt={3}
                                  mb={2}
                                >
                                  <Button
                                    onClick={handlePopoverClose}
                                    size={"sm"}
                                    bg="black"
                                    color="white"
                                    variant="solid"
                                    borderRadius={"xl"}
                                    _hover={{
                                      bg: "#222",
                                    }}
                                  >
                                    Aceptar
                                  </Button>
                                </Box>
                              </>
                            ) : (
                              <>
                                <Text>
                                  {"¿Seguro que quiere eliminar a " +
                                    contr.discord +
                                    "?"}
                                </Text>
                                <form
                                  onSubmit={(e) =>
                                    handleDeleteContributor(e, contr)
                                  }
                                >
                                  <Select
                                    isRequired
                                    focusBorderColor="white"
                                    placeholder="Proyecto"
                                    mt={"1.5rem"}
                                    className="contributors-popover-select"
                                  >
                                    {contributorProjects.map((project) => (
                                      <option
                                        key={project.address}
                                        value={project.address}
                                      >
                                        {project.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    p={4}
                                    mt={3}
                                  >
                                    <Button
                                      type="submit"
                                      size={"sm"}
                                      isLoading={deleteLoading}
                                      loadingText="Eliminando"
                                      bg="red"
                                      color="white"
                                      variant="solid"
                                      borderRadius={"xl"}
                                      _hover={{
                                        bg: "black",
                                      }}
                                      mt={-2}
                                    >
                                      Confirmar
                                    </Button>
                                  </Box>
                                </form>
                              </>
                            )}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default Contributors;
