import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import DiscordInviteComponent from "./DiscordInviteComponent";
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
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import toast from "./Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const CreateContributorComponent = ({ isOpen, setIsOpen, fetchUser }) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const [isOpenDiscordInviteComponent, setIsOpenDiscordInviteComponent] =
    useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contributorData = {
      email: event?.target[0]?.value,
      discord: event?.target[1]?.value,
      githubUsername: event?.target[2]?.value,
    };
    if (event?.target[3]?.value != "")
      contributorData.urlTwitter = event?.target[3]?.value;
    if (event?.target[4]?.value != "")
      contributorData.country = event?.target[4]?.value;
    if (user.address) {
      setLoading(true);
      const res = await fetch(API_URL + "users/contributor/" + user.address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(contributorData),
      });
      if (res?.ok) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const racksPM = new ethers.Contract(
          contractAddresses[CHAIN_ID].RacksProjectManager[0],
          RacksPmAbi,
          signer
        );
        try {
          let tx = await racksPM.registerContributor();
          await tx.wait();
          if (tx.hash) {
            notify("success", "Bienvenido a Racks Labs como Contributor!");
            setTimeout(async () => {
              await fetchUser();
            }, 1000);
            setTimeout(async () => {
              setIsOpenDiscordInviteComponent(true);
            }, 500);
          }
        } catch (error) {
          await fetch(API_URL + "users/contributor/" + user.address, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          });
          notify("error", "Error al registrarse como Contributor");
        }
      } else {
        notify("error", "Error al registrarse como Contributor");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent mt="10%">
          <ModalHeader className="text-center">
            REGISTRO DE CONTRIBUTOR
          </ModalHeader>
          <ModalCloseButton colorScheme="teal" />
          <form onSubmit={handleSubmit} autoComplete="off">
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  focusBorderColor="white"
                  borderRadius={"none"}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Github</FormLabel>
                <Input
                  type="text"
                  placeholder="Usuario de Github"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Discord</FormLabel>
                <Input
                  type="text"
                  placeholder="Usuario de Discord"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Twitter</FormLabel>
                <Input
                  type="text"
                  placeholder="Url Twitter"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>País</FormLabel>
                <Input
                  type="text"
                  placeholder="País"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Registrando"
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
                Registrarse
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
      <DiscordInviteComponent
        isOpen={isOpenDiscordInviteComponent}
        setIsOpen={setIsOpenDiscordInviteComponent}
      />
    </>
  );
};

export default CreateContributorComponent;
