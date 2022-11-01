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
  ModalFooter,
  Button,
  Box,
  Center,
  Link,
  Text,
} from "@chakra-ui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DiscordInviteComponent = ({ isOpen, setIsOpen }) => {
  const user = useSelector(selectUserInfo);
  const [discordInvite, setDiscordInvite] = useState("");

  const getDiscordInvite = async () => {
    if (user.contributor && user.verified) {
      const res = await fetch(API_URL + "discord-invite", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (res?.ok) {
        const data = await res.json();
        setDiscordInvite(data);
      } else {
        setDiscordInvite(undefined);
      }
    }
  };

  useEffect(() => {
    if (isOpen) getDiscordInvite();
  }, [isOpen, user]);

  return (
    <Modal
      isCentered
      autoFocus={false}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">INVITACIÓN DE DISCORD</ModalHeader>
        <ModalCloseButton colorScheme="white" />
        <ModalBody pb={6}>
          <Box p="4">
            <Center>
              {discordInvite == undefined ? (
                <Text>Error al generar invitación</Text>
              ) : (
                <Link href={discordInvite} isExternal>
                  {discordInvite}
                </Link>
              )}
            </Center>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => setIsOpen(false)}
            colorScheme="white"
            variant="outline"
            borderRadius={"none"}
            _hover={{ bg: "#dddfe236" }}
            size="sm"
            mt={-5}
            mb={1}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiscordInviteComponent;
