import React, { useState } from "react";
import {
  Container,
  Heading,
  Box,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

function FAQ() {
  const [items, setItems] = useState([
    {
      question: "¿Quién puede usar Racks Community?",
      answer:
        "Cualquier <b>holder de Mr.Crypto</b> puede usar la aplicación web para ver el estado de los proyectos, y podrán interactuar despues de registrarse. ",
    },
    {
      question: "¿Qué datos debo proporcionar para registrarme?",
      answer:
        "Podrás registrarte simplemente con un <b>email</b> y un usuario de <b>discord</b>, sin embargo, si queremos unirnos a un proyecto de programación es necesario introducir un usuario de <b>Github</b> válido.",
    },
    {
      question: "¿Qué puedo hacer una vez me he registrado?",
      answer:
        "En Racks Community podremos realizar principalmente 3 acciones. <br/> <ol> <li> 1: Crear proyectos </li> <li> 2: Unirse a proyectos </li> <li> 3: Hacer una donación a un proyecto </li> </ol>",
    },
    {
      question: "¿Cómo puedo crear un proyecto?",
      answer:
        "Podrás crear un proyecto desde la página del perfil. Una vez creado, el proyecto podrá ser aprobado por un administrador y aparecerá en la lista de proyectos, o rechazado. Una vez rechazado solo podrás eliminarlo.",
    },
    {
      question: "¿Qué hace a aplicación cuando crea un proyecto?",
      answer:
        "Aparte de la creación de un nuevo proyecto en base de datos y blockchain, se encarga de crear un repositorio de <b>Github</b> dentro de nuestra organización (este paso se omite si el proyecto no es de programación), y también crea una nueva sección con un canal de texto y voz en el server de <b>Discord</b> al que tendrán acceso aquellos que se unan al proyecto.",
    },
    {
      question:
        "¿Puedo crear un proyecto que no tiene que ver con la programación?",
      answer:
        'Por supuesto, tan solo tendrás que desmarcar el check que dice: "Es un proyecto de Programación".<br/> Sin embargo, para el correcto funcionamiento de la aplicación, recomendamos que todos los proyectos tengan un enfoque orientado a objetivos definidos, de forma que sea posible discernir cuando éste ha terminado.<br/> Todos los proyectos deberán seguir el modelo de encargo.',
    },
    {
      question: "¿Cómo puedo finalizar un proyecto?",
      answer:
        "Tal y como se indica en la app, deberás contactar con un adminstrador mediante un ticket en el server de <b>Discord</b>.<br/> El administrador agendará una reunión en la que todos los participantes llegan a un acuerdo sobre la participación de cada miembro, los puntos de reputación total a repartir, y finalizará el proyecto. <br/> La participación acordada se guardará en blockchain y será la referencia para repartir todas las recompensas. <br/><br/>",
    },
    {
      question: "¿Para qué sirve la Reputación?",
      answer:
        "El nivel de reputación determina que proyectos podemos ver, siendo que solo podemos ver proyectos cuyo nivel de reputación sea igual o menor que el nuestro, y los proyectos visibles para todos (opción seleccionable al crear proyecto). <br/> Para aumentar nuestra reputación debemos participar en proyectos que lleguen a completarse.<br/><br/> La relación entre puntos de Reputación y nivel de reputación es:&emsp; <b>Rep points = Rep level x 100</b><br/> Para nivel de reputación = 2 => necesitamos 200 puntos de reputación para subir al nivel 3, se guardan los puntos sobrantes, y los puntos necesarios ahora para el nivel 4 son 300 puntos.",
    },
    {
      question:
        "¿Por qué tengo que transferir un colateral para participar en un proyecto?",
      answer:
        "Es la mejor forma de exigir un compromiso, al final todos queremos que nuestros compañeros de equipo se lo tomen en serio. Aunque desde Racks Communit recomendamos establecer siempre un colateral ajustado a las exigencias del proyecto, esposible crear un proyecto que no requiera ningun colateral.",
    },
    {
      question: "¿Qué puede ocasionar que pierda el colateral introducido?",
      answer:
        "La única manera de perder el colateral es al ser baneado, no solo del proyecto sino de la plataforma. Es por tanto una medida drástica que responde a conductas realmente dañinas y malintencionadas que vayan en contra de los intereses del proyecto. Un ejemplo podría ser dañar el repositorio del proyecto con mala fe.",
    },
    {
      question:
        "¿Qué debo hacer si he ingresado en un proyecto pero ya no tengo tiempo para participar en el desarrollo?",
      answer:
        "Para evitar abusos por parte de usuarios que quieran acaparar proyectos, queremos incentivar que solo te unas a los proyectos en los que te puedas comprometer (estar a la vez en más de un proyecto no está prohibido pero no es aconsejable salvo que tengas el tiempo necesario).<br/> Por este motivo si no puedes continuar en un proyecto, deberás abrir un ticket para contactar con un adminstrador, el cual verá tu caso y te eliminará del proyecto devolviendo tu colateral. <b> Pero ten en cuenta que es una bala de un solo uso, no cumplir con el compromiso de forma recurrente se traducirá en ban.",
    },
  ]);

  const itemStyle = {
    bg: "#fefe0e",
    color: "black",
    fontWeight: "bold",
  };

  return (
    <>
      <Container
        className="profile-container"
        mt="-1.8rem"
        mb="3.2rem"
        maxW="50%"
        height={"100%"}
      >
        <Center>
          <Heading as="h1" mb="2rem" mt="2rem" className="rackspm-heading">
            FAQ
          </Heading>
        </Center>
        <Accordion mt="2rem">
          {items.map((item, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton _expanded={itemStyle}>
                  <Box as="span" flex="1" textAlign="left">
                    {item.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </>
  );
}

export default FAQ;
