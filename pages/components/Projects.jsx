import { Container, Text, Heading, Box } from "@chakra-ui/react";
import { useContractRead, useAccount } from "wagmi";
import { contractAddresses, ProjectAbi, RacksPmAbi } from "../../web3Constanst";
import { useState, useEffect } from "react";
import {} from "ethers";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import CreateProjectComponent from "./CreateProjectComponent";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Projects() {
  const user = useSelector(selectUserInfo);
  const [isOpenCreateProjectComponent, setIsOpenCreateProjectComponent] =
    useState(false);

  const handleDisplayCreateProject = () => {
    if (user.role === "admin") {
      setIsOpenCreateProjectComponent(true);
    }
  };

  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);

  const account = useAccount();

  useContractRead({
    addressOrName: contractAddresses[4].RacksProjectManager[0],
    contractInterface: RacksPmAbi,
    functionName: "getProjects",
    overrides: { from: account.address },
    onSuccess: (data) => setData(data),
    watch: true,
  });

  useEffect(() => {
    if (data) {
      let prj = [];
      data.map((address) => {
        const response = fetch(API_URL + "projects/" + address, {
          method: "get",
          headers: new Headers({
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.length > 0) prj.push(json[0]);
          });
      });
      console.log(prj);
      setProjects(prj);
    }
  }, [data]);

  return (
    <>
      <Container className="flex flex-col items-center" mt={"-1rem"} h="40vw">
        <Heading as="h1" mb="2rem">
          Racks Project Manager
        </Heading>
        {projects.length != 0 ? (
          projects.map((p) => (
            <Box p="6" alignItems={"center"} key={p}>
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                noOfLines={1}
              >
                {p.name}
              </Box>
              <Box>
                {p.description}
                <Box as="span" color="gray.600" fontSize="sm"></Box>
              </Box>
              {`${p.colateralCost} $`}
            </Box>
          ))
        ) : (
          <Text textAlign={"center"} fontSize={"1rem"}>
            No Projects
          </Text>
        )}
      </Container>
      <CreateProjectComponent
        isOpen={isOpenCreateProjectComponent}
        setIsOpen={setIsOpenCreateProjectComponent}
      />
    </>
  );
}

export default Projects;
