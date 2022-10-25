import { Container, Text, Heading, Box, Button, Grid } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../store/userSlice";
import CreateProjectComponent from "./CreateProjectComponent";
import UpdateProjectComponent from "./UpdateProjectComponent";
import ShowProjectComponent from "./ShowProjectComponent";
import ApproveProjectComponent from "./ApproveProjectComponent";
import Project from "./Project";
import Loading from "./Loading";
import { ObjectIsNotEmpty } from "../helpers/ObjectIsNotEmpty";
import { formatDate } from "../helpers/FormatDate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Projects() {
  const user = useSelector(selectUserInfo);
  const [isOpenCreateProjectComponent, setIsOpenCreateProjectComponent] =
    useState(false);
  const [isOpenUpdateProjectComponent, setIsOpenUpdateProjectComponent] =
    useState(false);
  const [isOpenShowProjectComponent, setIsOpenShowProjectComponent] =
    useState(false);
  const [isOpenApproveProjectComponent, setIsOpenApproveProjectComponent] =
    useState(false);
  const [sectionsNumber, setSectionsNumber] = useState(0);
  const [projectToUpdate, setProjectToUpdate] = useState({});
  const [projectToShow, setProjectToShow] = useState({});
  const [newProjects, setNewProjects] = useState([]);
  const [devProjects, setDevProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [pendingProjects, setPendigProjects] = useState([]);
  const status = {
    created: "CREATED",
    doing: "DOING",
    finished: "FINISHED",
  };
  const approveStatus = {
    pending: "PENDING",
    active: "ACTIVE",
  };

  const handleDisplayCreateProject = () => {
    if (user.role === "admin") {
      setIsOpenCreateProjectComponent(true);
    }
  };

  const handleProjectClick = (event, project) => {
    // Ignore when clicking on contributor icons
    if (
      event.target.classList[0] === "all-contributors" ||
      event.target.parentElement.classList[0] === "all-contributors"
    )
      return;
    else if (event.target.alt === "PFP") return;

    if (user.role === "admin") {
      if (project.approveStatus === "PENDING") {
        setProjectToShow(project);
        setIsOpenApproveProjectComponent(true);
      } else if (project.completed) {
        setProjectToShow(project);
        setIsOpenShowProjectComponent(true);
      } else {
        setProjectToUpdate(project);
        setIsOpenUpdateProjectComponent(true);
      }
    } else {
      setProjectToShow(project);
      setIsOpenShowProjectComponent(true);
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
      data.map((project) => {
        project.createdAt = formatDate(project.createdAt);
        if (project.completed) {
          project.completedAt = formatDate(project.completedAt);
        }
      });
      let nSections = 0;
      const newPjArray = data.filter(
        (project) =>
          project.status === status.created &&
          project.approveStatus === approveStatus.active
      );
      setNewProjects(newPjArray);
      if (newPjArray.length > 0) nSections++;

      const devPjArray = data.filter(
        (project) =>
          project.status === status.doing &&
          project.approveStatus === approveStatus.active
      );
      setDevProjects(devPjArray);
      if (devPjArray.length > 0) nSections++;

      const completedPjArray = data.filter(
        (project) =>
          project.status === status.finished &&
          project.approveStatus === approveStatus.active
      );
      setCompletedProjects(completedPjArray);
      if (completedPjArray.length > 0) nSections++;

      const pendingPjArray = data.filter(
        (project) => project.approveStatus === approveStatus.pending
      );
      setPendigProjects(pendingPjArray);
      if (pendingPjArray.length > 0) nSections++;

      setSectionsNumber(nSections);

      return user.role === "admin"
        ? data.length - pendingPjArray.length
        : data.length;
    }
  };

  const clearProjectToShow = () => {
    setProjectToShow({});
  };

  useEffect(() => {
    if (ObjectIsNotEmpty(user)) {
      fetchProjects();
    }
    if (!localStorage.getItem("token") && !ObjectIsNotEmpty(user)) {
      localStorage.removeItem("token");
      router.reload();
    }
  }, [user]);

  return (
    <>
      <Loading />
      <Container
        className="flex flex-col items-center projects-container"
        mt="-1.2rem"
        mb={"-1.2rem"}
      >
        <Heading as="h1" mb="1rem" className="rackspm-heading">
          Racks Project Manager
        </Heading>

        {user.role === "admin" && (
          <Button
            onClick={handleDisplayCreateProject}
            mb="1rem"
            mr="1rem"
            variant="outline"
            colorScheme="white"
            borderRadius={"none"}
            _hover={{ bg: "white", color: "black" }}
          >
            Create Project
          </Button>
        )}
        {newProjects.length > 0 && (
          <Box mb="-1rem" w={"80vw"} className="flex flex-col">
            <Text fontSize="2xl" as="kbd" className="project-section-title">
              Proyectos Nuevos
            </Text>
            <Grid pb="1.65rem" className={"projects-section-flex"}>
              {newProjects.map((p) => (
                <Project
                  project={p}
                  handleProjectClick={handleProjectClick}
                  privateProject={false}
                  key={p.address}
                />
              ))}
            </Grid>
          </Box>
        )}
        {devProjects.length > 0 && (
          <Box mb="-1rem" w={"80vw"} className="flex flex-col">
            <Text
              fontSize="2xl"
              as="kbd"
              alignSelf={"start"}
              className="project-section-title"
            >
              Proyectos en Desarrollo
            </Text>
            <Grid pb="1.65rem" className={"projects-section-flex"}>
              {devProjects.map((p) => (
                <Project
                  project={p}
                  handleProjectClick={handleProjectClick}
                  privateProject={false}
                  key={p.address}
                />
              ))}
            </Grid>
          </Box>
        )}
        {completedProjects.length > 0 && (
          <Box mb="-1rem" w={"80vw"} className="flex flex-col">
            <Text
              fontSize="2xl"
              as="kbd"
              alignSelf={"start"}
              className="project-section-title"
            >
              Proyectos Completados
            </Text>
            <Grid pb="1.65rem" className={"projects-section-flex"}>
              {completedProjects.map((p) => (
                <Project
                  project={p}
                  handleProjectClick={handleProjectClick}
                  privateProject={false}
                  key={p.address}
                />
              ))}
            </Grid>
          </Box>
        )}
        {pendingProjects.length > 0 && user.role === "admin" && (
          <Box mb="-1rem" w={"80vw"} className="flex flex-col">
            <Text
              fontSize="2xl"
              as="kbd"
              alignSelf={"start"}
              className="project-section-title"
            >
              Proyectos Pendientes
            </Text>
            <Grid pb="1.65rem" className={"projects-section-flex"}>
              {pendingProjects.map((p) => (
                <Project
                  project={p}
                  handleProjectClick={handleProjectClick}
                  privateProject={true}
                  key={p.address}
                />
              ))}
            </Grid>
          </Box>
        )}
        {newProjects.length == 0 &&
          devProjects.length == 0 &&
          completedProjects.length == 0 &&
          pendingProjects.length == 0 && (
            <Text fontSize={"1rem"} ml="-1rem" mb="68.8vh">
              No Projects
            </Text>
          )}
      </Container>
      <CreateProjectComponent
        isOpen={isOpenCreateProjectComponent}
        setIsOpen={setIsOpenCreateProjectComponent}
        fetchProjects={fetchProjects}
        interval={false}
      />
      <UpdateProjectComponent
        isOpen={isOpenUpdateProjectComponent}
        setIsOpen={setIsOpenUpdateProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToUpdate}
      />
      <ShowProjectComponent
        isOpen={isOpenShowProjectComponent}
        setIsOpen={setIsOpenShowProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToShow}
        clearProject={clearProjectToShow}
      />
      <ApproveProjectComponent
        isOpen={isOpenApproveProjectComponent}
        setIsOpen={setIsOpenApproveProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToShow}
      />
      {sectionsNumber !== 1 && (
        <style global jsx>{`
          main {
            height: auto;
          }
        `}</style>
      )}
    </>
  );
}

export default Projects;
