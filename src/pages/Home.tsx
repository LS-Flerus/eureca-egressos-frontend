import { Box, Button, Center, Collapsible, Flex, Grid, Image, Input, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardHeader, CardRoot, CardTitle } from "@chakra-ui/react/card";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";
import FiltroCampus from "@/components/home/filtros/FiltroCampus";
import FiltroCurso from "@/components/home/filtros/FiltroCurso";
import FiltroPeriodo from "@/components/home/filtros/FiltroPeriodo";

const Home = () => {

    const [openIndex, setOpenIndex] = useState(null);
    
    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <>
        <Box h={"100vh"} overflowY={"hidden"}>
            <Box pl={"15vh"} pt={"5vh"} pr={"15vh"}>
                <Flex justify="space-between" align="center">
                    <Flex pl="8vh" gap="4" align="center">
                        <Image src="src/assets/escudo-ufcg.png" />
                        <Image src="src/assets/eureca_egressos_logo.png" />
                    </Flex>
                    <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO}>Login</Button>
                </Flex>

                <Box display={"flex"} pt={"4vh"} spaceX={"24"}>
                    <CardRoot className="margin-top" bg={EURECA_COLORS.CINZA}>
                        <CardBody>
                            <Text fontSize={"lg"}>Bem-vindo ao Eureca Egressos! Aqui você pode conferir  a versão digital das placas de concluintes dos e-gressos da UFCG.</Text>
                        </CardBody>
                    </CardRoot>
                    <Spacer />
                    <CardRoot className="margin-top" bg={EURECA_COLORS.CINZA}>
                        <CardBody>
                            <Text fontSize={"lg"}>Caso seja um coordenador de curso ou parte de uma comissão de formatura, realize seu login no sistema para ter acesso à seu perfil.</Text>
                        </CardBody>
                    </CardRoot>
                </Box>

                <Box display={"flex"} pt={"4vh"}>
                    <CardRoot flex="1" className="margin-top" bg={EURECA_COLORS.AZUL_ESCURO}>
                        <CardBody alignItems={"center"}>
                            <Text fontSize={"3xl"}>Pesquisar Placas</Text>
                        </CardBody>
                    </CardRoot>
                </Box>

                <Box display={"flex"} pt={"2vh"} spaceX={"10"}>
                    <Input placeholder="Pesquisar nome de aluno..." bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black"></Input>
                    <Input placeholder="Pesquisar nome de turma..." bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black"></Input>
                </Box>

                <Grid maxH={"67vh"} overflowY={"auto"} className="grid-cols-3 margin-top-s" pb={8} pt={3} gap={4}>
                    <FiltroCampus />
                    <FiltroCurso />
                    <FiltroPeriodo />
                </Grid>
            </Box>
        </Box>
    </>
  );
};

export default Home;
