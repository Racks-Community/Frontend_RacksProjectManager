import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import {
  contractAddresses,
  ProjectAbi,
  MockErc20Abi,
} from "../../web3Constants";
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
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const FundProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
}) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = event?.target[0]?.value;

    if (user.address && amount > 0) {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const account = (await provider.send("eth_requestAccounts", []))[0];

      const mockErc20 = new ethers.Contract(
        contractAddresses[CHAIN_ID].MockErc20[0],
        MockErc20Abi,
        signer
      );
      let erctx = await mockErc20.approve(
        project.address,
        ethers.utils.parseEther(amount + "")
      );
      await erctx.wait();
      const projectContract = new ethers.Contract(
        project.address,
        ProjectAbi,
        signer
      );

      try {
        let tx = await projectContract.fundProject(
          ethers.utils.parseEther(amount + "")
        );
        await tx.wait();
        if (tx.hash) {
          const projectData = { funderWallet: account, amount };
          const res = await fetch(
            API_URL + "projects/fund/" + project.address,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
              body: JSON.stringify(projectData),
            }
          );
          if (res?.ok) {
            await fetchProjects();
            toast.success("Ha donado " + amount + " USDT en el Proyecto!");
          } else {
            toast.error("Error al donar al Proyecto");
          }
        }
      } catch (error) {
        toast.error("Error al donar al Proyecto");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isCentered
        autoFocus={false}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">DONAR AL PROYECTO</ModalHeader>
          <ModalCloseButton colorScheme="teal" />
          <form onSubmit={handleSubmit} autoComplete="off">
            <ModalBody pb={6}>
              <FormControl mt={4} isRequired>
                <FormLabel>Cantidad a Donar</FormLabel>
                <Input
                  type="number"
                  min="1"
                  placeholder="100 USDT"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Donar"
                variant="outline"
                bg="transparent"
                borderColor={"#FEFE0E"}
                color="white"
                borderRadius={"none"}
                _hover={{
                  bg: "#FEFE0E",
                  color: "black",
                  transition: "0.5s",
                }}
                size="sm"
                mr={3}
                mb={1}
              >
                Donar
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                colorScheme="white"
                variant="outline"
                borderRadius={"none"}
                _hover={{ bg: "#dddfe236" }}
                size="sm"
                mb={1}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FundProjectComponent;
