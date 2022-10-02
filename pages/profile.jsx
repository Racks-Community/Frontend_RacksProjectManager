import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../store/userSlice";
import { useRouter } from "next/router";
import { contractAddresses, MrCryptoAbi } from "../web3Constants";
import { ethers } from "ethers";
import {
  Container,
  Heading,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Center,
  Image,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import toast from "./components/Toast";
import {
  getMRCImageUrlFromId,
  getMRCImageUrlFromMetadata,
  getMRCMetadataUrl,
} from "./helpers/MRCImages";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

function Profile() {
  const user = useSelector(selectUserInfo);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedMRC, setSelectedMRC] = useState("#");
  const [profileId, setprofileId] = useState(-1);
  const [MRCBackground, setMRCBackground] = useState("");
  const [MRCIds, setMRCIds] = useState([]);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const contributorData = {};
    if (event?.target[0]?.value != user.avatar)
      contributorData.avatar = await getMRCMetadataUrl(event?.target[0]?.value);
    if (event?.target[1]?.value != user.email)
      contributorData.email = event?.target[1]?.value;
    if (event?.target[2]?.value != user.githubUsername)
      contributorData.githubUsername = event?.target[2]?.value;
    if (event?.target[3]?.value != user.discord)
      contributorData.discord = event?.target[3]?.value;
    if (event?.target[4]?.value != user.urlTwitter)
      contributorData.urlTwitter = event?.target[4]?.value;
    if (event?.target[5]?.value != user.country)
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
        notify("success", "Perfil de Contributor actualizada!");
      } else {
        notify("error", "Error al actualizar el perfil");
      }
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const res = await fetch(API_URL + "token", {
      method: "get",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      dispatch(setUserInfo(data.user));
    }
  };

  const handleOnChangeToken = async (event) => {
    if (event.target.value) {
      const tokenId = event.target.value;
      const uri = await getMRCImageUrlFromId(tokenId);
      setSelectedMRC(uri);
      const metadataUri = await getMRCMetadataUrl(tokenId);
      const tokenJson = await (await fetch(metadataUri)).json();
      setprofileId(tokenJson.edition);
      setMRCBackgroundStyles(tokenJson.attributes[0].value);
    } else {
      setSelectedMRC("#");
    }
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
  };

  const setMRCBackgroundStyles = (color) => {
    if (color === "Brown") {
      setMRCBackground("linear-gradient(90deg, #A8A288 0, #62300A)");
    } else if (color === "Gray") {
      setMRCBackground("linear-gradient(90deg, #87A9A2 0, #252525)");
    } else if (color === "Blue") {
      setMRCBackground("linear-gradient(90deg, #9CCEF1 0, #002A67)");
    } else if (color === "Pink") {
      setMRCBackground("linear-gradient(90deg, #FF8BE4 0, #D80066)");
    } else if (color === "Yellow") {
      setMRCBackground("linear-gradient(90deg, #FAE174 0, #FF8A00)");
    } else if (color === "Orange") {
      setMRCBackground("linear-gradient(90deg, #FF8600 0, #FD2302)");
    } else if (color === "Mint") {
      setMRCBackground("linear-gradient(90deg, #00FF91 0, #003E00)");
    } else if (color === "Fuchsia") {
      setMRCBackground("linear-gradient(90deg, #F339B8 0, #5A032E)");
    }
  };

  useEffect(() => {
    if (user.contributor && profileId == -1) {
      (async () => {
        const tokenJson = await (await fetch(user.avatar)).json();
        setSelectedMRC(await getMRCImageUrlFromMetadata(tokenJson));
        setprofileId(tokenJson.edition);
        setMRCBackgroundStyles(tokenJson.attributes[0].value);
      })();
    }
    if (user.role === "user" && MRCIds.length == 0) {
      fetchMRC();
    }
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <Container className="flex flex-col items-center profile-container">
        <Box bg={MRCBackground} w="100vw" h="6rem">
          <Center>
            <Image
              borderRadius="full"
              boxSize="120px"
              src={selectedMRC}
              fallbackSrc={"./fallback.gif"}
              alt="PFP"
              mt={"1.6rem"}
            />
          </Center>
        </Box>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid templateColumns="repeat(2, 1fr)" w="30vw" mt="3.2rem">
            <GridItem colSpan={2}>
              <Center>
                <Select
                  isRequired
                  value={profileId}
                  onChange={handleOnChangeToken}
                  focusBorderColor="white"
                  w="11rem"
                  mb={"3"}
                  mt={"2rem"}
                >
                  {MRCIds.map((tokenId) => (
                    <option key={tokenId} value={tokenId}>
                      {"MRC " + tokenId}
                    </option>
                  ))}
                </Select>
              </Center>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  defaultValue={user.email}
                  placeholder="Email"
                  focusBorderColor="white"
                  borderRadius={"none"}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                />
              </FormControl>
            </GridItem>

            <FormControl isRequired pr="3" pt="6  ">
              <FormLabel>Github</FormLabel>
              <Input
                type="text"
                defaultValue={user.githubUsername}
                placeholder="Usuario de Github"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl isRequired pl="3" pt="6">
              <FormLabel>Discord</FormLabel>
              <Input
                type="text"
                defaultValue={user.discord}
                placeholder="Usuario de Discord"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl pr="3" pt="6">
              <FormLabel>Twitter</FormLabel>
              <Input
                type="text"
                defaultValue={user.urlTwitter}
                placeholder="Url Twitter"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl pl="3" pt="6">
              <FormLabel>País</FormLabel>
              <Input
                type="text"
                defaultValue={user.country}
                placeholder="País"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>
            <GridItem colSpan={2}>
              <Center>
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
                  size="sm"
                  w="9rem"
                  mt={8}
                >
                  Actualizar
                </Button>
              </Center>
            </GridItem>
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default Profile;
