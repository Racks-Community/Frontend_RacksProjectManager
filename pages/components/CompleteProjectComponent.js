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
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  Box,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import toast from "./Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CompleteProjectComponent = ({
  isOpen,
  setIsOpen,
  fetchProjects,
  project,
}) => {
  const user = useSelector(selectUserInfo);
  const [loading, setLoading] = useState(false);
  const [participationIsValid, setParticipationIsValid] = useState(true);
  const [participations, setParticipation] = useState([]);
  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const checkParticipationIsValid = () => {
    let total = 0;
    for (let contr of participations) {
      total += contr.participation;
    }
    total > 100
      ? setParticipationIsValid(false)
      : setParticipationIsValid(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (user.role === "admin" && participationIsValid) {
      let contributors = [];
      let weights = [];
      for (const contr of participations) {
        contributors.push(contr.address);
        weights.push(contr.participation);
      }

      const projectData = {
        totalReputationPointsReward: event?.target[0]?.value,
        contributors: contributors,
        participationWeights: weights,
      };

      setLoading(true);
      const res = await fetch(
        API_URL + "projects/completed/" + project.address,
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
        setTimeout(async () => {
          await fetchProjects();
        }, 1000);
        notify("success", "Proyecto finalizado!");
      } else {
        notify("error", "Error al finalizar Proyecto");
      }
      setIsOpen(false);
      setLoading(false);
    }
  };

  const fetchProjectParticipation = async () => {
    if (
      user.role === "admin" &&
      project.address &&
      project.status === "DOING" &&
      project.contributors.length > 0 &&
      participations.length == 0
    ) {
      const res = await fetch(
        API_URL + "projects/participation/" + project.address,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (res?.ok) {
        const data = await res.json();
        setParticipation(data);
      }
    }
  };

  useEffect(() => {
    if (
      user.role === "admin" &&
      project.address &&
      project.status === "DOING" &&
      project.contributors.length > 0
    ) {
      fetchProjectParticipation();
    }
  }, [isOpen]);

  useEffect(() => {
    checkParticipationIsValid();
  }, [participations]);

  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">FINALIZAR PROYECTO</ModalHeader>
          <ModalCloseButton colorScheme="teal" />
          <form
            onSubmit={(event) => handleSubmit(event, participations)}
            autoComplete="off"
          >
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Puntos de Reputación totales</FormLabel>
                <Input
                  type="text"
                  placeholder="Puntos de Reputación"
                  focusBorderColor="white"
                  borderRadius={"none"}
                />
              </FormControl>

              {participations.length > 0 && (
                <Box>
                  {participations.map((contributor) => (
                    <Box key={contributor.address} pt={6} pb={2}>
                      <FormLabel mb={"2.5rem"}>{contributor.name}</FormLabel>
                      <Slider
                        colorScheme={participationIsValid ? "yellow" : "red"}
                        aria-label="slider-ex-6"
                        onChange={(val) =>
                          setParticipation(
                            participations.map((c) =>
                              c.address == contributor.address
                                ? { ...c, participation: val }
                                : { ...c }
                            )
                          )
                        }
                      >
                        <SliderMark value={20} fontSize="sm" mt="3">
                          20%
                        </SliderMark>
                        <SliderMark value={50} fontSize="sm" mt="3">
                          50%
                        </SliderMark>
                        <SliderMark value={80} fontSize="sm" mt="3">
                          80%
                        </SliderMark>
                        <SliderMark
                          value={contributor.participation}
                          textAlign="center"
                          bg={participationIsValid ? "#FEFE0E" : "red"}
                          color="black"
                          fontWeight="semibold"
                          mt="-10"
                          ml="-5"
                          w="12"
                        >
                          {Math.round(contributor.participation * 10) / 10}%
                        </SliderMark>
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>
                  ))}
                </Box>
              )}
            </ModalBody>

            <ModalFooter mt={3}>
              <Button
                type="submit"
                isLoading={loading}
                loadingText="Finalizar"
                isDisabled={!participationIsValid}
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
                Finalizar
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
    </>
  );
};

export default CompleteProjectComponent;
