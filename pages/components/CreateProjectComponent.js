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
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const CreateProjectComponent = ({ isOpen, setIsOpen }) => {
  const user = useSelector(selectUserInfo);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const projectData = {
      email: event?.target[0]?.value,
      password: event?.target[1]?.value,
    };

    if (user.role === "admin") {
      const res = await fetch(API_URL + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (res?.ok) {
        const data = await res.json();
        localStorage.setItem("token", "Bearer " + data.token);
        localStorage.setItem("manualLogin", true);
        dispatch(setUserInfo(data.user));
        router.push("/");
      } else {
        setIsPasswordInvalid(true);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent mt="15%">
        <ModalHeader className="text-center">CREATE PROJECT</ModalHeader>
        <ModalCloseButton colorScheme="teal" />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="text"
                placeholder="Password"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
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
            >
              Login
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
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateProjectComponent;
