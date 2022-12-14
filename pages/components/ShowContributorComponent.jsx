import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Divider,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Center,
  Image,
  Link,
} from "@chakra-ui/react";
import { getMRCImageUrlFromMetadata } from "../../helpers/MRCImages";
import ObjectIsNotEmpty from "../../helpers/ObjectIsNotEmpty";

const ShowContributorComponent = ({ isOpen, setIsOpen, contributor }) => {
  const [contributorMRC, setContributorMRC] = useState(null);

  useEffect(() => {
    if (contributor.avatar) {
      (async () => {
        const tokenJson = await (await fetch(contributor.avatar)).json();
        setContributorMRC(getMRCImageUrlFromMetadata(tokenJson));
      })();
    }
  }, [contributor]);

  if (ObjectIsNotEmpty(contributor)) {
    return (
      <Modal
        isCentered
        autoFocus={false}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="modal"
      >
        <ModalOverlay />
        <ModalContent w="25rem">
          <ModalHeader className="text-center">
            DETALLES CONTRIBUTOR
          </ModalHeader>
          <ModalCloseButton colorScheme="white" />
          <ModalBody pb={4}>
            <Box>
              <Center>
                <Image
                  borderRadius="full"
                  boxSize="100px"
                  src={contributorMRC}
                  fallbackSrc={"./fallback.gif"}
                  alt="MRC"
                  mb="3"
                />
              </Center>
              <Box
                mt="1"
                ml="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
              >
                <Center>{contributor.discord}</Center>
              </Box>
              <Divider
                w={"95%"}
                mx={"auto"}
                mt="2"
                mb="1rem"
                style={{ borderColor: "#FEFE0E" }}
              />
              <Center>
                <VStack alignItems="center">
                  <HStack>
                    {contributor.isOwner && (
                      <Badge borderRadius="full" px="2" colorScheme="green">
                        Owner
                      </Badge>
                    )}
                    {contributor.isContributor && (
                      <Badge borderRadius="full" px="2" colorScheme="yellow">
                        {"Reputation Level " + contributor.reputationLevel}
                      </Badge>
                    )}
                  </HStack>
                  <Grid templateColumns="repeat(2, 1fr)">
                    <GridItem
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      textTransform="uppercase"
                    >
                      <Text color="gray">Proyectos Totales:</Text>
                    </GridItem>
                    <GridItem
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      ml="1rem"
                    >
                      {contributor.totalProjects}
                    </GridItem>
                    <GridItem
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      textTransform="uppercase"
                      mt="1"
                    >
                      <Text color="gray">Github</Text>
                    </GridItem>
                    <GridItem
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      ml="1rem"
                      mt="1"
                    >
                      <Link
                        href={
                          "https://github.com/" + contributor.githubUsername
                        }
                        isExternal
                      >
                        {contributor.githubUsername}
                      </Link>
                    </GridItem>
                    {contributor.urlTwitter && contributor.urlTwitter != "" && (
                      <>
                        <GridItem
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          textTransform="uppercase"
                          mt="1"
                        >
                          <Text color="gray">Twitter</Text>
                        </GridItem>
                        <GridItem
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          ml="1rem"
                          mt="1"
                        >
                          <Link href={contributor.urlTwitter} isExternal>
                            {contributor.urlTwitter}
                          </Link>
                        </GridItem>
                      </>
                    )}
                    {contributor.participationWeight > 0 && (
                      <>
                        <GridItem
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          textTransform="uppercase"
                          mt="1"
                        >
                          <Text color="gray">Participación</Text>
                        </GridItem>
                        <GridItem
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          ml="1rem"
                          mt="1"
                        >
                          {contributor.participationWeight + "%"}
                        </GridItem>
                      </>
                    )}
                    <GridItem
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      textTransform="uppercase"
                      mt="1"
                    >
                      <Text color="gray">Contributor desde:</Text>
                    </GridItem>
                    <GridItem
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      ml="1rem"
                      mt="1"
                    >
                      {contributor.createdAt}
                    </GridItem>
                  </Grid>
                </VStack>
              </Center>
            </Box>
          </ModalBody>

          <ModalFooter>
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
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  } else {
    return <></>;
  }
};

export default ShowContributorComponent;
