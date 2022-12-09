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
  Grid,
  Checkbox,
  GridItem,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CreateProjectComponent = ({ isOpen, setIsOpen, fetchProjects }) => {
  const user = useSelector(selectUserInfo);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let nProjectsBefore = await fetchProjects();
    const formData = new FormData();
    formData.append("name", event?.target[1]?.value);
    formData.append("description", event?.target[2]?.value);
    formData.append("reputationLevel", event?.target[5]?.value);
    formData.append("colateralCost", event?.target[7]?.value);
    formData.append("maxContributorsNumber", event?.target[8]?.value);
    formData.append("owner", user._id);
    if (event?.target[0]?.value != "" && selectedFile != null) {
      formData.append("imageURL", selectedFile);
    }
    if (event?.target[3]?.value != "") {
      formData.append("details", event?.target[3]?.value);
    }
    if (event?.target[4]?.value != "") {
      formData.append("requirements", event?.target[4]?.value);
    }
    if (event?.target[6]?.checked) {
      formData.append("visibleForAll", event?.target[6]?.checked);
    }
    if (event?.target[9]?.value != "") {
      formData.append("githubRepository", event?.target[9]?.value);
    }
    setLoading(true);
    const res = await fetch(API_URL + "projects", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: formData,
    });

    if (res?.ok) {
      let count = 0;
      const fetchProjectsInterval = setInterval(async () => {
        let nProjects = await fetchProjects();
        count++;
        if (nProjects > nProjectsBefore || count == 30)
          clearInterval(fetchProjectsInterval);
      }, 1000);
      toast.success("Proyecto creado!");
    } else {
      toast.error("Error al crear Proyecto");
    }
    setIsOpen(false);
    setLoading(false);
  };

  const changeFileHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    const file = document.querySelector("#img-selector");
    file.style.setProperty("--contentText", `"${event.target.files[0].name}"`);
  };

  return (
    <Modal
      isCentered
      autoFocus={false}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalOverlay />
      <ModalContent style={{ overflow: "hidden" }}>
        <ModalHeader className="text-center">CREAR PROYECTO</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          encType="multipart/form-data"
        >
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
                name="name"
                placeholder="Nombre"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={3} isRequired>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                type="text"
                name="description"
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
                name="details"
                placeholder="Detalles"
                focusBorderColor="white"
                borderRadius={"none"}
                resize={"none"}
              />
            </FormControl>

            <FormControl mt={3} isRequired>
              <FormLabel>Requerimientos</FormLabel>
              <Input
                type="text"
                name="requirements"
                placeholder="Requerimientos"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)" className="create-pj-grid">
              <GridItem>
                <FormControl mt={3} isRequired>
                  <FormLabel>Nivel de Reputación</FormLabel>
                  <Input
                    type="number"
                    name="reputationLevel"
                    placeholder="Reputación"
                    focusBorderColor="white"
                    borderRadius={"none"}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl
                  mt={"3.2rem"}
                  ml={"4"}
                  colSpan={1}
                  className="visibility-check"
                >
                  <Checkbox colorScheme="green">Visible para todos</Checkbox>
                </FormControl>
              </GridItem>
            </Grid>

            <FormControl mt={3} isRequired>
              <FormLabel>Colateral</FormLabel>
              <Input
                type="number"
                name="colateralCost"
                placeholder="Colateral"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={3} isRequired>
              <FormLabel>Número máximo de Contribuidores</FormLabel>
              <Input
                type="number"
                name="maxContributorsNumber"
                placeholder="Número de Contribuidores"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Repositorio Github</FormLabel>
              <Input
                type="text"
                placeholder="Github Repository"
                focusBorderColor="white"
                borderRadius={"none"}
                resize={"none"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              isLoading={loading}
              loadingText="Crear"
              bg="white"
              color="black"
              variant="solid"
              borderRadius={"none"}
              _hover={{
                bg: "#dddfe2",
              }}
              size="sm"
              mr={3}
              mt={-4}
            >
              Crear
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              colorScheme="white"
              variant="outline"
              borderRadius={"none"}
              _hover={{ bg: "#dddfe236" }}
              size="sm"
              mt={-4}
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
