import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import DiscordInviteComponent from "./DiscordInviteComponent";
import { contractAddresses, MrCryptoAbi } from "../../web3Constants";
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
  Center,
  Select,
  Image,
} from "@chakra-ui/react";
import toast from "./Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

const CompleteRegisterComponent = ({ isOpen, setIsOpen, fetchUser }) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const [MRCIds, setMRCIds] = useState([]);
  const [selectedMRC, setSelectedMRC] = useState("#");
  const [isOpenDiscordInviteComponent, setIsOpenDiscordInviteComponent] =
    useState(false);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sendDiscordInvite = user.verified;
    const contributorData = {
      avatar: await getMRCUrl(event?.target[0]?.value),
      email: event?.target[1]?.value,
      githubUsername: event?.target[2]?.value,
      discord: event?.target[3]?.value,
    };
    if (event?.target[4]?.value != "")
      contributorData.urlTwitter = event?.target[4]?.value;
    if (event?.target[5]?.value != "")
      contributorData.country = event?.target[5]?.value;

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
        notify("success", "Perfil de Contributor actualizado!");
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

  const getMRCUrl = async (tokenId) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-rpc.com"
    );
    const MRC = new ethers.Contract(
      "0xeF453154766505FEB9dBF0a58E6990fd6eB66969",
      MrCryptoAbi,
      provider
    );
    const uri = await MRC.tokenURI(tokenId);
    uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    return uri;
  };

  const getMRCImageUrl = async (tokenId) => {
    const uri = await getMRCUrl(tokenId);
    const tokenURIResponse = await (await fetch(uri)).json();
    const imageURI = tokenURIResponse.image;
    const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    return imageURIURL;
  };

  const fetchMRC = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const MRC = new ethers.Contract(
      contractAddresses[CHAIN_ID].MRCRYPTO[0],
      MrCryptoAbi,
      signer
    );
    const tokenIds = await MRC.walletOfOwner(
      (
        await provider.send("eth_requestAccounts", [])
      )[0]
    );
    let ids = [];
    for (let id of tokenIds) {
      ids.push(ethers.BigNumber.from(id).toNumber());
    }
    setMRCIds(ids);
    await getMRCUrl(ids[0]);
  };

  const handleOnChangeToken = async (event) => {
    if (event.target.value) {
      const uri = await getMRCImageUrl(event.target.value);
      setSelectedMRC(uri);
    } else {
      setSelectedMRC("#");
    }
  };

  useEffect(() => {
    if (user.role === "user" && user.address) {
      fetchMRC();
    }
  }, [isOpen]);

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

export default CompleteRegisterComponent;
