import React, { useState, useEffect } from "react";

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
import { toast } from "react-toastify";
import CompleteProjectComponent from "./CompleteProjectComponent";
import ObjectIsNotEmpty from "../../helpers/ObjectIsNotEmpty";
import { deleteProjectAPI, updateProjectAPI } from "../../helpers/APICalls";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isProjectOwner = () => {
    return project.owner === user._id;
  };

  const onCloseDeleteProjectPopover = () => {
    setIsOpenDeleteProjectPopover(false);
  };

  const handleDeleteProject = async () => {
    setIsOpenDeleteProjectPopover(false);
    if (user.role === "admin" || isProjectOwner()) {
      setDeleteLoading(true);
      const data = await deleteProjectAPI(project.address);
      if (data) {
        setTimeout(async () => {
          await fetchProjects();
        }, 1000);
        toast.success("Proyecto eliminado");
      } else {
        toast.error("Error al eliminar Proyecto");
      }
      setIsOpen(false);
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    if (event?.target[0]?.value != "" && selectedFile != null)
      formData.append("imageURL", selectedFile);
    if (project.name !== event?.target[1]?.value)
      formData.append("name", event?.target[1]?.value);
    if (project.description !== event?.target[2]?.value)
      formData.append("description", event?.target[2]?.value);
    if (project.details !== event?.target[3]?.value)
      formData.append("details", event?.target[3]?.value);
    if (project.requirements !== event?.target[4]?.value)
      formData.append("requirements", event?.target[4]?.value);
    if (project.reputationLevel !== Number(event?.target[5]?.value))
      formData.append("reputationLevel", Number(event?.target[5]?.value));
    if (project.colateralCost !== Number(event?.target[6]?.value))
      formData.append("colateralCost", Number(event?.target[6]?.value));
    if (project.maxContributorsNumber !== Number(event?.target[7]?.value))
      formData.append("maxContributorsNumber", Number(event?.target[7]?.value));
    if (
      (project.githubRepository !== event?.target[8]?.value &&
        user.role === "admin") ||
      isProjectOwner
    )
      formData.append("githubRepository", event?.target[8]?.value);

    if (user.role === "admin" || isProjectOwner) {
      setLoading(true);
      const data = await updateProjectAPI(project.address, formData);

      if (data) {
        setTimeout(async () => {
          await fetchProjects();
        }, 1000);
        toast.success("Proyecto actualizado!");
      } else {
        toast.error("Error al actualizar Proyecto");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  const changeFileHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    const file = document.querySelector("#img-selector");
    file.style.setProperty("--contentText", `"${event.target.files[0].name}"`);
  };

  if (ObjectIsNotEmpty(project)) {
    return (
      <>
        <Modal
          isCentered
          autoFocus={false}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size={"lg"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className="text-center">
              GESTIONAR PROYECTO
            </ModalHeader>
            <ModalCloseButton colorScheme="teal" />
            <form onSubmit={handleSubmit} autoComplete="off">
              <ModalBody pb={5}>
                <FormControl>
                  <input
                    id="img-selector"
                    name="imageURL"
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                  />
                </FormControl>
                <FormControl mt={-5} isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type="text"
                    isDisabled={project.status !== "CREATED"}
                    defaultValue={project.name}
                    placeholder="Nombre"
                    focusBorderColor="white"
                    borderRadius={"none"}
                  />
                </FormControl>

                <FormControl mt={3} isRequired>
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

                <FormControl mt={3}>
                  <FormLabel>Detalles</FormLabel>
                  <Textarea
                    type="text"
                    defaultValue={project.details}
                    placeholder="Detalles"
                    focusBorderColor="white"
                    borderRadius={"none"}
                    resize={"none"}
                    height={"0.5rem"}
                  />
                </FormControl>

                <FormControl mt={3} isRequired>
                  <FormLabel>Requerimientos</FormLabel>
                  <Input
                    type="text"
                    defaultValue={project.requirements}
                    placeholder="Requerimientos"
                    focusBorderColor="white"
                    borderRadius={"none"}
                    resize={"none"}
                  />
                </FormControl>

                <FormControl mt={3} isRequired>
                  <FormLabel>Nivel de Reputación</FormLabel>
                  <Input
                    min={1}
                    type="number"
                    isDisabled={project.status !== "CREATED"}
                    defaultValue={project.reputationLevel}
                    placeholder="Reputación"
                    focusBorderColor="white"
                    borderRadius={"none"}
                  />
                </FormControl>

                <FormControl mt={3} isRequired>
                  <FormLabel>Colateral</FormLabel>
                  <Input
                    min={0}
                    type="number"
                    isDisabled={project.status !== "CREATED"}
                    defaultValue={project.colateralCost}
                    placeholder="Colateral"
                    focusBorderColor="white"
                    borderRadius={"none"}
                  />
                </FormControl>

                <FormControl mt={3} isRequired>
                  <FormLabel>Número máximo de Participantes</FormLabel>
                  <Input
                    min={1}
                    type="number"
                    defaultValue={project.maxContributorsNumber}
                    placeholder="Número de Participantes"
                    focusBorderColor="white"
                    borderRadius={"none"}
                  />
                </FormControl>

                {(user.role === "admin" || isProjectOwner) &&
                  project.githubRepository && (
                    <FormControl
                      mt={3}
                      isRequired={project.approveStatus == "ACTIVE"}
                    >
                      <FormLabel>Repositorio Github</FormLabel>
                      <Input
                        type="text"
                        isDisabled={project.status !== "CREATED"}
                        defaultValue={project.githubRepository}
                        placeholder="Github Repository"
                        focusBorderColor="white"
                        borderRadius={"none"}
                        resize={"none"}
                      />
                    </FormControl>
                  )}
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
                  className="custom-buttons"
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
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <Button
                      onClick={() => setIsOpenDeleteProjectPopover(true)}
                      className="custom-buttons"
                      isLoading={deleteLoading}
                      loadingText="Eliminar"
                      bg="red"
                      color="white"
                      variant="solid"
                      borderRadius={"none"}
                      _hover={{
                        bg: "#e01d1d",
                      }}
                      isDisabled={project.status === "DOING"}
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
                  className="custom-buttons"
                  isLoading={loading}
                  loadingText="Actualizar"
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
                  className="custom-buttons"
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
  } else {
    return <></>;
  }
};

export default UpdateProjectComponent;
