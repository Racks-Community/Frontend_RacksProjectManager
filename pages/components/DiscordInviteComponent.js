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
        return data;
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      getDiscordInvite().then((invite) => setDiscordInvite(invite));
    }
  }, [isOpen, user]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent mt="18%">
        <ModalHeader className="text-center">INVITACIÓN DE DISCORD</ModalHeader>
        <ModalCloseButton colorScheme="white" />
        <ModalBody pb={6}>
          <Box p="4">
            <Center>
              <Link href={discordInvite} isExternal>
                {discordInvite}
              </Link>
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
            _active={{
              bg: "#dddfe236",
              transform: "scale(1.05)",
            }}
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
