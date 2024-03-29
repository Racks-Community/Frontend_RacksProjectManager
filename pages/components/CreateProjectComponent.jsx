import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import { contractAddresses, RacksPmAbi } from "../../web3Constants";
import { ethers } from "ethers";
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
import {
  createProjectAPI,
  deletePendingProjectAPI,
} from "../../helpers/APICalls";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

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
    formData.append("isProgramming", event?.target[5]?.checked);
    formData.append("reputationLevel", event?.target[6]?.value);
    formData.append("colateralCost", event?.target[8]?.value);
    formData.append("maxContributorsNumber", event?.target[9]?.value);
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
    if (event?.target[7]?.checked) {
      formData.append("visibleForAll", event?.target[7]?.checked);
    }
    setLoading(true);

    try {
      const data = await createProjectAPI(formData);

      if (data) {
        if (user.role === "user") {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const racksPM = new ethers.Contract(
            contractAddresses[CHAIN_ID].RacksProjectManager,
            RacksPmAbi,
            signer
          );
          let tx = await racksPM.createProject(
            formData.get("name"),
            ethers.utils.parseEther(formData.get("colateralCost") + ""),
            formData.get("reputationLevel"),
            formData.get("maxContributorsNumber")
          );
          await tx.wait();
        }
        let count = 0;
        const fetchProjectsInterval = setInterval(async () => {
          let nProjects = await fetchProjects();
          count++;
          if (nProjects > nProjectsBefore || count == 30)
            clearInterval(fetchProjectsInterval);
        }, 1000);
        toast.success("Proyecto creado!");
      }
    } catch (error) {
      await deletePendingProjectAPI(formData.get("name"));
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
                pattern="^[A-Za-z0-9 _]*$"
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

            <FormControl mt={"1rem"}>
              <Checkbox colorScheme="green" defaultChecked>
                Es un proyecto de Programación
              </Checkbox>
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)" className="create-pj-grid">
              <GridItem>
                <FormControl mt={3} isRequired>
                  <FormLabel>Nivel de Reputación</FormLabel>
                  <Input
                    min={1}
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
                min={0}
                type="number"
                name="colateralCost"
                placeholder="Colateral"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={3} isRequired>
              <FormLabel>Número máximo de Miembros</FormLabel>
              <Input
                min={1}
                type="number"
                name="maxContributorsNumber"
                placeholder="Número de Participantes"
                focusBorderColor="white"
                borderRadius={"none"}
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
