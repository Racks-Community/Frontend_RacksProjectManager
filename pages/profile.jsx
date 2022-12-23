import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, setUserInfo } from "../store/userSlice";
import { useRouter } from "next/router";
import CreateProjectComponent from "./components/CreateProjectComponent";
import UpdateProjectComponent from "./components/UpdateProjectComponent";
import Project from "./components/Project";
import {
  Tooltip,
  Text,
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
  VStack,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  getMRCImageUrlFromId,
  getMRCImageUrlFromMetadata,
  getMRCMetadataUrl,
  fetchNFTIds,
} from "../helpers/MRCImages";
import Loading from "./components/Loading";
import { formatDate } from "../helpers/FormatDate";
import { ObjectIsNotEmpty } from "../helpers/ObjectIsNotEmpty";
import { fetchUser } from "../helpers/APICalls";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Profile() {
  const user = useSelector(selectUserInfo);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenCreateProjectComponent, setIsOpenCreateProjectComponent] =
    useState(false);
  const [isOpenUpdateProjectComponent, setIsOpenUpdateProjectComponent] =
    useState(false);
  const [selectedMRC, setSelectedMRC] = useState("#");
  const [profileId, setprofileId] = useState(-1);
  const [contrCreatedAt, setContrCreatedAt] = useState(null);
  const [MRCBackground, setMRCBackground] = useState("");
  const [MRCIds, setMRCIds] = useState([]);
  const [MRCToken, setMRCToken] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectToUpdate, setProjectToUpdate] = useState({});

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
          await fetchUserCall();
        }, 1000);
        toast.success("Perfil de Holder actualizado!");
      } else {
        toast.error("Error al actualizar el perfil");
      }
      setLoading(false);
    }
  };

  const handleDisplayCreateProject = () => {
    setIsOpenCreateProjectComponent(true);
  };

  const fetchUserCall = async () => {
    const data = await fetchUser();
    dispatch(setUserInfo(data.user));
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
      setMRCToken(tokenJson);
    } else {
      setSelectedMRC("#");
    }
  };

  const fetchProjects = async () => {
    const res = await fetch(API_URL + "projects", {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
      }),
    });
    if (res?.ok) {
      const data = await res.json();
      data = data.filter((project) => project.owner === user._id);
      for (const project of data) {
        project.createdAt = formatDate(project.createdAt);
      }
      setProjects(data);
      return data.length;
    }
  };

  const getMRCIds = async () => {
    const ids = await fetchNFTIds();
    setMRCIds(ids);
  };

  const handleProjectClick = (event, project) => {
    if (event.target.alt === "PFP") return;
    setProjectToUpdate(project);
    setIsOpenUpdateProjectComponent(true);
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

  const getTextColorOnBackground = () => {
    if (MRCToken) {
      const color = MRCToken.attributes[0].value;
      if (
        color === "Brown" ||
        color === "Gray" ||
        color === "Blue" ||
        color === "Mint" ||
        color === "Fuchsia"
      ) {
        return "#fff";
      } else if (color === "Pink" || color === "Yellow" || color === "Orange") {
        return "#000";
      }
    }
  };

  useEffect(() => {
    if (user.contributor && profileId == -1) {
      (async () => {
        const tokenJson = await (await fetch(user.avatar)).json();
        setSelectedMRC(getMRCImageUrlFromMetadata(tokenJson));
        setprofileId(tokenJson.edition);
        setMRCBackgroundStyles(tokenJson.attributes[0].value);
        setMRCToken(tokenJson);
        setContrCreatedAt(formatDate(user.createdAt));
      })();
    }
    if (user.role === "user" && MRCIds.length == 0) {
      getMRCIds();
    }
    if (!localStorage.getItem("token") && !ObjectIsNotEmpty(user)) {
      localStorage.removeItem("token");
      router.push("/");
    }
    if (ObjectIsNotEmpty(user)) {
      fetchProjects();
    }
  }, [user]);

  return (
    <>
      <Loading />
      <Box className="flex flex-col items-center profile-container">
        <Box bg={MRCBackground} className="profile-mrc-background">
          <VStack
            className="profile-reputation-text"
            color={getTextColorOnBackground}
          >
            <Text>
              {"Reputation Level " + user.reputationLevel} <br />
              {user.reputationPoints + " Reputation Points"}
            </Text>
          </VStack>
          <VStack
            className="profile-projects-text"
            color={getTextColorOnBackground}
          >
            <Text>
              {"Projects Joined: " + user.totalProjects} <br />
              {"Joined at: " + contrCreatedAt}
            </Text>
          </VStack>
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
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="profile-form"
        >
          <Grid
            templateColumns="repeat(2, 1fr)"
            w="30vw"
            mt="2.5rem"
            className="profile-form-grid"
          >
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
            <GridItem colSpan={2} mt="-5" className="profie-input-email">
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

            <FormControl isRequired pr="3" pt="1.5">
              <FormLabel>Github</FormLabel>
              <Input
                type="text"
                defaultValue={user.githubUsername}
                placeholder="Usuario de Github"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl isRequired pl="3" pt="1.5">
              <FormLabel>Discord</FormLabel>
              <Input
                type="text"
                defaultValue={user.discord}
                placeholder="Usuario de Discord"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl pr="3" pt="1.5">
              <FormLabel>Twitter</FormLabel>
              <Input
                type="text"
                defaultValue={user.urlTwitter}
                placeholder="Url Twitter"
                focusBorderColor="white"
                borderRadius={"none"}
              />
            </FormControl>

            <FormControl pl="3" pt="1.5">
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
                  className="custom-buttons"
                  isLoading={loading}
                  loadingText="Actualizar"
                  bg="white"
                  color="black"
                  variant="solid"
                  borderRadius={"none"}
                  _hover={{
                    bg: "#dddfe2",
                  }}
                  size="sm"
                  w="8rem"
                  mt={4}
                >
                  Actualizar
                </Button>
              </Center>
            </GridItem>
          </Grid>
        </form>
        <Center mt="3rem">
          <Heading as="h1" mb="1.5rem" className="rackspm-heading">
            Tus Proyectos
          </Heading>
        </Center>
        <Center>
          <Tooltip
            label="Solo puedes tener 3 Proyectos a la vez."
            bg="#333"
            hasArrow
            shouldWrapChildren
            isDisabled={projects.length < 3}
          >
            <Button
              onClick={handleDisplayCreateProject}
              className="custom-buttons"
              variant="outline"
              bg="transparent"
              borderColor={"#FEFE0E"}
              color="white"
              borderRadius={"none"}
              disabled={projects.length >= 3}
              _hover={{
                bg: "#FEFE0E",
                color: "black",
                transition: "0.5s",
              }}
            >
              Crear Proyecto
            </Button>
          </Tooltip>
        </Center>
        {projects.length > 0 && (
          <Grid
            templateColumns="repeat(4, 1fr)"
            className={"projects-section-flex"}
            py="3"
          >
            {projects.map((p) => (
              <Project
                project={p}
                handleProjectClick={handleProjectClick}
                privateProject={true}
                key={p.address}
              />
            ))}
          </Grid>
        )}
      </Box>
      <CreateProjectComponent
        isOpen={isOpenCreateProjectComponent}
        setIsOpen={setIsOpenCreateProjectComponent}
        fetchProjects={fetchProjects}
      />
      <UpdateProjectComponent
        isOpen={isOpenUpdateProjectComponent}
        setIsOpen={setIsOpenUpdateProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToUpdate}
      />
      {projects.length > 0 && (
        <style global jsx>{`
          main {
            height: auto;
          }
        `}</style>
      )}
    </>
  );
}

export default Profile;
