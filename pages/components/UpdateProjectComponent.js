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
} from "@chakra-ui/react";
import toast from "./Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UpdateProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
}) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

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
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent mt="11%">
        <ModalHeader className="text-center">ACTUALIZAR PROYECTO</ModalHeader>
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

          <ModalFooter>
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
              _active={{
                bg: "#dddfe2",
                transform: "scale(1.05)",
              }}
              mr={3}
              mt={-5}
              mb={1}
            >
              Update
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              _hover={{ bg: "#dddfe236" }}
              _active={{
                bg: "#dddfe236",
                transform: "scale(1.05)",
              }}
              mt={-5}
              mb={1}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProjectComponent;
