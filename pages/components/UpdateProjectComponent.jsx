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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
} from "@chakra-ui/react";
import toast from "./Toast";
import CompleteProjectComponent from "./CompleteProjectComponent";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UpdateProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
}) => {
  const user = useSelector(selectUserInfo);
  const [isOpenDeleteProjectPopover, setIsOpenDeleteProjectPopover] =
    useState(false);
  const [isOpenCompleteProjectComponent, setIsOpenCompleteProjectComponent] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const onCloseDeleteProjectPopover = () => {
    setIsOpenDeleteProjectPopover(false);
  };

  const handleDeleteProject = async () => {
    setIsOpenDeleteProjectPopover(false);
    if (user.role === "admin") {
      setDeleteLoading(true);
      const res = await fetch(API_URL + "projects/" + project.address, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res?.ok) {
        setTimeout(async () => {
          await fetchProjects();
        }, 1000);
        notify("success", "Proyecto eliminado");
      } else {
        notify("error", "Error al eliminar Proyecto");
      }
      setIsOpen(false);
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const projectData = {};
    if (project.name !== event?.target[0]?.value)
      projectData.name = event?.target[0]?.value;
    if (project.description !== event?.target[1]?.value)
      projectData.description = event?.target[1]?.value;
    if (project.requirements !== event?.target[2]?.value)
      projectData.requirements = event?.target[2]?.value;
    if (project.reputationLevel !== Number(event?.target[3]?.value))
      projectData.reputationLevel = Number(event?.target[3]?.value);
    if (project.colateralCost !== Number(event?.target[4]?.value))
      projectData.colateralCost = Number(event?.target[4]?.value);
    if (project.maxContributorsNumber !== Number(event?.target[5]?.value))
      projectData.maxContributorsNumber = Number(event?.target[5]?.value);

    if (user.role === "admin") {
      setLoading(true);
      const res = await fetch(API_URL + "projects/" + project.address, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(projectData),
      });

      if (res?.ok) {
        setTimeout(async () => {
          await fetchProjects();
        }, 1000);
        notify("success", "Proyecto actualizado!");
      } else {
        notify("error", "Error al actualizar Proyecto");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">GESTIONAR PROYECTO</ModalHeader>
          <ModalCloseButton colorScheme="teal" />
          <form onSubmit={handleSubmit} autoComplete="off">
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  type="text"
                  defaultValue={project.name}
                  placeholder="Nombre"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  type="text"
                  defaultValue={project.description}
                  placeholder="Descripción"
                  focusBorderColor="white"
                  borderRadius={"none"}
                  resize={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Requerimientos</FormLabel>
                <Textarea
                  type="text"
                  defaultValue={project.requirements}
                  placeholder="Requerimientos"
                  focusBorderColor="white"
                  borderRadius={"none"}
                  resize={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Nivel de Reputación</FormLabel>
                <Input
                  type="number"
                  defaultValue={project.reputationLevel}
                  placeholder="Reputación"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Colateral</FormLabel>
                <Input
                  type="number"
                  defaultValue={project.colateralCost}
                  placeholder="Colateral"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Número máximo de Contribuidores</FormLabel>
                <Input
                  type="number"
                  defaultValue={project.maxContributorsNumber}
                  placeholder="Número de Contribuidores"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                onClick={() => {
                  setIsOpen(false);
                  setIsOpenCompleteProjectComponent(true);
                }}
                isDisabled={
                  !(
                    project.status === "DOING" &&
                    project.contributors.length > 0
                  )
                }
                bg="#FEFE0E"
                color="black"
                variant="solid"
                borderRadius={"none"}
                _hover={{
                  bg: "#d6cb02",
                }}
                mr={3}
                mt={-5}
                mb={1}
              >
                Finalizar
              </Button>
              <Popover
                isOpen={isOpenDeleteProjectPopover}
                onClose={onCloseDeleteProjectPopover}
                placement="top"
              >
                <PopoverTrigger>
                  <Button
                    onClick={() => setIsOpenDeleteProjectPopover(true)}
                    isLoading={deleteLoading}
                    loadingText="Eliminando"
                    bg="red"
                    color="white"
                    variant="solid"
                    borderRadius={"none"}
                    _hover={{
                      bg: "#e01d1d",
                    }}
                    mr={3}
                    mt={-5}
                    mb={1}
                  >
                    Eliminar
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
                    Eliminar Proyecto
                  </PopoverHeader>
                  <PopoverBody align="center">
                    ¿Está seguro de que quiere eliminar este proyecto?
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
                      onClick={() => handleDeleteProject()}
                      size={"sm"}
                      bg="red"
                      color="white"
                      variant="solid"
                      borderRadius={"xl"}
                      _hover={{
                        bg: "#e01d1d",
                      }}
                      mr={3}
                      mt={-5}
                      mb={1}
                    >
                      Confirmar
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Actualizando"
                bg="white"
                color="black"
                variant="solid"
                borderRadius={"none"}
                _hover={{
                  bg: "#dddfe2",
                }}
                mr={3}
                mt={-5}
                mb={1}
              >
                Actualizar
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                colorScheme="white"
                variant="outline"
                borderRadius={"none"}
                _hover={{ bg: "#dddfe236" }}
                mt={-5}
                mb={1}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <CompleteProjectComponent
        isOpen={isOpenCompleteProjectComponent}
        setIsOpen={setIsOpenCompleteProjectComponent}
        fetchProjects={fetchProjects}
        project={project}
      />
    </>
  );
};

export default UpdateProjectComponent;
