import {
  Container,
  Text,
  Heading,
  Box,
  Button,
  Grid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
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
  const [isOpenProjectPopover, setIsOpenProjectPopover] = useState(false);
  const [isOpenCompletedPopover, setIsOpenCompletedPopover] = useState(false);
  const [isOpenBlockedNewPopover, setIsOpenBlockedNewPopover] = useState(false);
  const [isOpenBlockedDevPopover, setIsOpenBlockedDevPopover] = useState(false);
  const [blockedPopoverBody, setBlockedPopoverBody] = useState("");
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
    if (event.target.alt === "PFP") return;
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
      const userIsProjectContributor =
        project.contributors.indexOf(user._id) > -1;
      if (user.contributor && user.verified) {
        if (project.completed && !userIsProjectContributor) {
          setIsOpenCompletedPopover(true);
        } else if (user.reputationLevel < project.reputationLevel) {
          onOpenBlockedPopover(project);
        } else if (
          project.contributors.length === project.maxContributorsNumber &&
          !userIsProjectContributor
        ) {
          onOpenBlockedPopover(project);
        } else {
          setProjectToShow(project);
          setIsOpenShowProjectComponent(true);
        }
      } else {
        setIsOpenProjectPopover(true);
      }
    }
  };

  const onCloseProjectPopover = () => {
    setIsOpenProjectPopover(false);
  };

  const onOpenBlockedPopover = (project) => {
    if (user.reputationLevel < project.reputationLevel) {
      setBlockedPopoverBody("Nivel de Reputación Insuficiente");
    } else if (project.contributors.length === project.maxContributorsNumber) {
      setBlockedPopoverBody("El Proyecto no admite nuevos Contributors");
    }
    project.status === "CREATED"
      ? setIsOpenBlockedNewPopover(true)
      : setIsOpenBlockedDevPopover(true);
  };
  const onCloseBlockedNewPopover = () => {
    setIsOpenBlockedNewPopover(false);
  };

  const onCloseBlockedDevPopover = () => {
    setIsOpenBlockedDevPopover(false);
  };

  const onCloseCompletedPopover = () => {
    setIsOpenCompletedPopover(false);
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
      setNewProjects(
        data.filter(
          (project) =>
            project.status === status.created &&
            project.approveStatus === approveStatus.active
        )
      );
      setDevProjects(
        data.filter(
          (project) =>
            project.status === status.doing &&
            project.approveStatus === approveStatus.active
        )
      );
      setCompletedProjects(
        data.filter(
          (project) =>
            project.status === status.finished &&
            project.approveStatus === approveStatus.active
        )
      );
      setPendigProjects(
        data.filter(
          (project) => project.approveStatus === approveStatus.pending
        )
      );
      return data.length;
    }
  };

  useEffect(() => {
    if (ObjectIsNotEmpty(user)) {
      fetchProjects();
    }
  }, []);

  return (
    <>
      <Loading />
      <Container
        className="flex flex-col items-center projects-container"
        mt="-1.2rem"
        mb={"-1.2rem"}
      >
        <Popover isOpen={isOpenProjectPopover} onClose={onCloseProjectPopover}>
          <PopoverTrigger>
            <Heading as="h1" mb="1rem" className="rackspm-heading">
              Racks Project Manager
            </Heading>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Se un Contributor!</PopoverHeader>
            <PopoverBody>
              Para participar en un proyecto antes debe registrarse como
              Contributor.
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {user.role === "admin" && (
          <Button
            onClick={handleDisplayCreateProject}
            className="custom-buttons"
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
          <Box mb="-1rem" w={"60vw"} className="flex flex-col">
            <Text fontSize="2xl" as="kbd" className="project-section-title">
              Proyectos Nuevos
            </Text>
            <Popover
              isOpen={isOpenBlockedNewPopover}
              onClose={onCloseBlockedNewPopover}
            >
              <PopoverTrigger>
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
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader borderColor="red">No disponible</PopoverHeader>
                <PopoverBody>{blockedPopoverBody}</PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
        {devProjects.length > 0 && (
          <Box mb="-1rem" w={"60vw"} className="flex flex-col">
            <Text
              fontSize="2xl"
              as="kbd"
              alignSelf={"start"}
              className="project-section-title"
            >
              Proyectos en Desarrollo
            </Text>
            <Popover
              isOpen={isOpenBlockedDevPopover}
              onClose={onCloseBlockedDevPopover}
            >
              <PopoverTrigger>
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
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader borderColor="red">No disponible</PopoverHeader>
                <PopoverBody>{blockedPopoverBody}</PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
        {completedProjects.length > 0 && (
          <Box mb="-1rem" w={"60vw"} className="flex flex-col">
            <Text
              fontSize="2xl"
              as="kbd"
              alignSelf={"start"}
              className="project-section-title"
            >
              Proyectos Completados
            </Text>
            <Popover
              isOpen={isOpenCompletedPopover}
              onClose={onCloseCompletedPopover}
            >
              <PopoverTrigger>
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
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader borderColor="red">
                  Proyecto Completado
                </PopoverHeader>
                <PopoverBody>El Proyecto ya está terminado.</PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        )}
        {pendingProjects.length > 0 && user.role === "admin" && (
          <Box mb="-1rem" w={"60vw"} className="flex flex-col">
            <Text
              fontSize="2xl"
              as="kbd"
              alignSelf={"start"}
              className="project-section-title"
            >
              Proyectos Pendientes de Aprobación
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
      />
      <ApproveProjectComponent
        isOpen={isOpenApproveProjectComponent}
        setIsOpen={setIsOpenApproveProjectComponent}
        fetchProjects={fetchProjects}
        project={projectToShow}
      />
      <style global jsx>{`
        main {
          height: auto;
        }
      `}</style>
    </>
  );
}

export default Projects;
