import React, { useState, useEffect } from "react";
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
  Select,
  Image,
  Center,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  fetchNFTIds,
  getMRCImageUrlFromId,
  getMRCMetadataUrl,
} from "../../helpers/MRCImages";
import {
  createContributorAPI,
  createContributorWebhookAPI,
  deleteUserAPI,
} from "../../helpers/APICalls";

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const CreateContributorComponent = ({ isOpen, setIsOpen, fetchUser }) => {
  const user = useSelector(selectUserInfo);
  const [MRCIds, setMRCIds] = useState([]);
  const [selectedMRC, setSelectedMRC] = useState("#");
  const [loading, setLoading] = useState(false);
  const [isOpenDiscordInviteComponent, setIsOpenDiscordInviteComponent] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contributorData = {
      avatar: await getMRCMetadataUrl(event?.target[0]?.value),
      email: event?.target[1]?.value,
      discord: event?.target[2]?.value,
      githubUsername: event?.target[3]?.value || "undefined",
    };
    if (event?.target[4]?.value != "")
      contributorData.urlTwitter = event?.target[4]?.value;
    if (event?.target[5]?.value != "")
      contributorData.country = event?.target[5]?.value;

    if (user.address) {
      setLoading(true);

      try {
        await createContributorAPI(user.address, contributorData);
        try {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const racksPM = new ethers.Contract(
            contractAddresses[CHAIN_ID].RacksProjectManager,
            RacksPmAbi,
            signer
          );
          const isContributor = await racksPM.isWalletContributor(user.address);
          if (isContributor) {
            const response = await createContributorWebhookAPI(user.address);
            setTimeout(async () => {
              await handleError();
            }, 40000);

            if (response) {
              setTimeout(async () => {
                await fetchUser();
              }, 1000);
              toast.success("Bienvenido a Racks Community!");
              setIsOpenDiscordInviteComponent(true);
            }
          } else {
            let tx = await racksPM.registerContributor();
            await tx.wait();
            if (tx.hash) {
              setTimeout(async () => {
                await fetchUser();
              }, 1000);
              toast.success("Bienvenido a Racks Community!");
              setIsOpenDiscordInviteComponent(true);
            }
          }
        } catch (error) {
          await handleError();
        }
      } catch (error) {
        await handleError();
      }

      setTimeout(async () => {
        if (loading) {
          setIsOpen(false);
          setLoading(false);
          await handleError();
        }
      }, 10000);
    }

    setIsOpen(false);
    setLoading(false);
  };

  const handleError = async () => {
    await deleteUserAPI(user.address);
    toast.error("Error al registrarse");
  };

  const handleOnChangeToken = async (event) => {
    if (event.target.value) {
      const uri = await getMRCImageUrlFromId(event.target.value);
      setSelectedMRC(uri);
    } else {
      setSelectedMRC("#");
    }
  };

  const getMRCIds = async () => {
    const ids = await fetchNFTIds();
    setMRCIds(ids);
  };

  const onClose = () => {
    setSelectedMRC("#");
    setIsOpen(false);
  };

  useEffect(() => {
    if (user.role === "user" && user.address) {
      getMRCIds();
    }
  }, [isOpen]);

  return (
    <>
      <Modal isCentered autoFocus={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">REGISTRO DE MIEMBRO</ModalHeader>
          <ModalCloseButton colorScheme="teal" />
          <form onSubmit={handleSubmit} autoComplete="off">
            <ModalBody pb={6}>
              <Center>
                <Image
                  borderRadius="full"
                  boxSize="100px"
                  src={selectedMRC}
                  fallbackSrc={"./fallback.gif"}
                  alt="PFP"
                />
              </Center>
              <Select
                isRequired
                onChange={handleOnChangeToken}
                focusBorderColor="white"
                placeholder="Foto de perfil"
                mb={"3"}
                mt={"2rem"}
              >
                {MRCIds.map((tokenId) => (
                  <option key={tokenId} value={tokenId}>
                    {"MRC " + tokenId}
                  </option>
                ))}
              </Select>
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
                <FormLabel>Discord</FormLabel>
                <Input
                  type="text"
                  placeholder="Usuario de Discord"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Github</FormLabel>
                <Input
                  type="text"
                  placeholder="Usuario de Github"
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
                loadingText="Registrarse"
                bg="white"
                color="black"
                variant="solid"
                borderRadius={"none"}
                _hover={{
                  bg: "#dddfe2",
                }}
                size="sm"
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
                size="sm"
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
