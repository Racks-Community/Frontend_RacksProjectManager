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
import toast from "../components/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CreateProjectComponent = ({ isOpen, setIsOpen, fetchProjects }) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let nProjectsBefore = await fetchProjects();
    const projectData = {
      name: event?.target[0]?.value,
      description: event?.target[1]?.value,
      reputationLevel: event?.target[3]?.value,
      colateralCost: event?.target[4]?.value,
      maxContributorsNumber: event?.target[5]?.value,
    };
    if (event?.target[2]?.value != "") {
      projectData.requirements = event?.target[2]?.value;
    }

    if (user.role === "admin") {
      setLoading(true);
      const res = await fetch(API_URL + "projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(projectData),
      });

      if (res?.ok) {
        const fetchProjectsInterval = setInterval(async () => {
          let nProjects = await fetchProjects();
          if (nProjects > nProjectsBefore) clearInterval(fetchProjectsInterval);
        }, 1000);
        notify("success", "Proyecto creado!");
      } else {
        notify("error", "Error al crear Proyecto");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent mt="9%">
        <ModalHeader className="text-center">CREAR PROYECTO</ModalHeader>
        <ModalCloseButton colorScheme="teal" />
        <form onSubmit={handleSubmit} autoComplete="off">
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                placeholder="Nombre"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                type="text"
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
                placeholder="Reputación"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Colateral</FormLabel>
              <Input
                type="number"
                placeholder="Colateral"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Número máximo de Contribuidores</FormLabel>
              <Input
                type="number"
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
              loadingText="Creando"
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
              Crear
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

export default CreateProjectComponent;
