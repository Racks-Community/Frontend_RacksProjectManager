import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import DiscordInviteComponent from "./DiscordInviteComponent";
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

const ProfileComponent = ({ isOpen, setIsOpen, fetchUser }) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [isOpenDiscordInviteComponent, setIsOpenDiscordInviteComponent] =
    useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sendDiscordInvite = user.verified;
    const contributorData = {};
    if (event?.target[0]?.value != profile.email)
      contributorData.email = event?.target[0]?.value;
    if (event?.target[1]?.value != profile.githubUsername)
      contributorData.githubUsername = event?.target[1]?.value;
    if (event?.target[2]?.value != profile.discord)
      contributorData.discord = event?.target[2]?.value;
    if (event?.target[3]?.value != profile.urlTwitter)
      contributorData.urlTwitter = event?.target[3]?.value;
    if (event?.target[4]?.value != profile.country)
      contributorData.country = event?.target[4]?.value;
    if (user.contributor) {
      setLoading(true);
      const res = await fetch(API_URL + "users/" + user.address, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(contributorData),
      });
      if (res?.ok) {
        setTimeout(async () => {
          await fetchUser();
        }, 1000);
        notify("success", "Perfil de Contributor actualizada!");
        setTimeout(async () => {
          if (sendDiscordInvite) setIsOpenDiscordInviteComponent(true);
        }, 1000);
      } else {
        notify("error", "Error al actualizar el perfil");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const res = await fetch(API_URL + "users/" + user.address, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    if (res?.ok) {
      const data = await res.json();
      setProfile(data);
    }
  };

  useEffect(() => {
    if (user.contributor) {
      fetchUserProfile();
    }
  }, [user]);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">
            {user.verified ? <>PERFIL</> : <> COMPLETA TU REGISTRO</>}
          </ModalHeader>
          <ModalCloseButton colorScheme="teal" />
          <form onSubmit={handleSubmit} autoComplete="off">
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  defaultValue={profile.email}
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
                  defaultValue={profile.githubUsername}
                  placeholder="Usuario de Github"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Discord</FormLabel>
                <Input
                  type="text"
                  defaultValue={profile.discord}
                  placeholder="Usuario de Discord"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Twitter</FormLabel>
                <Input
                  type="text"
                  defaultValue={profile.urlTwitter}
                  placeholder="Url Twitter"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>País</FormLabel>
                <Input
                  type="text"
                  defaultValue={profile.country}
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
      <DiscordInviteComponent
        isOpen={isOpenDiscordInviteComponent}
        setIsOpen={setIsOpenDiscordInviteComponent}
      />
    </>
  );
};

export default ProfileComponent;
