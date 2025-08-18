import { Box, Button, Center, Collapsible, Flex, Grid, Image, Input, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardHeader, CardRoot, CardTitle } from "@chakra-ui/react/card";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";
import FiltroCurso from "@/components/home/filtros/FiltroCurso";
import FiltroPeriodo from "@/components/home/filtros/FiltroPeriodo";
import FiltroCampus from "@/components/home/filtros/FiltroCampus";
import FiltroNomes from "@/components/home/filtros/FiltroNomes";

const Home = () => {

  return (
    <>
        <Box h={"100vh"} overflowY={"auto"}>
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

                <FiltroNomes />

                <Box h={"67vh"}>
                    <Grid
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        pb={8}
                        pt={3}
                        alignItems="start"
                    >
                        <FiltroCampus />
                        <FiltroCurso />
                        <FiltroPeriodo />
                    </Grid>
                </Box>

                <Box>

                </Box>

            </Box>
        </Box>
    </>
  );
};

export default Home;
