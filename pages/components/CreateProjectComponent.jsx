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
  Box,
} from "@chakra-ui/react";
import toast from "./Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CreateProjectComponent = ({ isOpen, setIsOpen, fetchProjects }) => {
  const user = useSelector(selectUserInfo);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let nProjectsBefore = await fetchProjects();

    const formData = new FormData();
    formData.append("name", event?.target[1]?.value);
    formData.append("description", event?.target[2]?.value);
    formData.append("reputationLevel", event?.target[4]?.value);
    formData.append("colateralCost", event?.target[5]?.value);
    formData.append("maxContributorsNumber", event?.target[6]?.value);
    formData.append("owner", event?.target[1]?.value);
    if (event?.target[0]?.value != "" && selectedFile != null) {
      formData.append("imageURL", selectedFile);
    }
    if (event?.target[3]?.value != "") {
      formData.append("requirements", event?.target[2]?.value);
    }
    console.log(formData);

    if (user.role === "admin") {
      setLoading(true);
      const res = await fetch(API_URL + "projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
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

  const changeFileHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    const file = document.querySelector("#img-selector");
    file.style.setProperty("--contentText", `"${event.target.files[0].name}"`);
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">CREAR PROYECTO</ModalHeader>
        <ModalCloseButton colorScheme="teal" />
        <form onSubmit={handleSubmit} autoComplete="off">
          <ModalBody pb={6}>
            <FormControl mt={2}>
              <input
                id="img-selector"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </FormControl>
            <FormControl mt={-4} isRequired>
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
