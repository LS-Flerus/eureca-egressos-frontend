import { Box, Button, Center, Flex, For, Grid, GridItem, IconButton, Image, Input, SimpleGrid, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useRef, useState } from "react";
import FiltroCurso from "@/components/home/filtros/FiltroCurso";
import FiltroPeriodo from "@/components/home/filtros/FiltroPeriodo";
import FiltroCampus from "@/components/home/filtros/FiltroCampus";
import FiltroNomes from "@/components/home/filtros/FiltroNomes";
import { CardPlaca } from "@/components/home/CardPlaca";
import { GetEurecaProfileResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation } from "@tanstack/react-query";
import { createPlacasEspecificas, getPlacasByFilter } from "@/service/placasService";
import { LuChevronLeft } from "react-icons/lu";

const CoordinatorHome = () => {

    const [resultsPlacasCriadas, setResultsPlacasCriadas] = useState<PlacaResponse[] | null>(null);
    const [listaPeriodosParaCriarPlacas, setListaPeriodosParaCriarPlacas] = useState<string>();

    const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));

    const createSpecificPlaques = useMutation({
        mutationKey: ["getCreatedPlaquesByFilter"],
        mutationFn: createPlacasEspecificas,
        onSuccess: async (data) => {
            const courseCode = String(eurecaProfile.attributes.code)
            const placasCriadas = await getPlacasByFilter({courseCode: courseCode})
            setResultsPlacasCriadas(placasCriadas);
        },
        onError: (error) => {
          console.log(error);
        },
    });
    
    const handleCreatePlacasEspecificas = async () => {
        const courseCode = String(eurecaProfile.attributes.code)
        createSpecificPlaques.mutate({periodos: listaPeriodosParaCriarPlacas, codigoDeCurso: courseCode})
    };


    return (
        <>
        <Box h={"100vh"} overflowY={"auto"}>
            <Box pl={"15vh"} pt={"5vh"} pr={"15vh"}>
                <Flex justify="space-between" align="center">
                    <Flex pl="8vh" gap="4" align="center">

                    </Flex>
                    <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO}>Sair</Button>
                </Flex>
                <Box mt={6} h="50vh">
                    <Grid templateColumns={"1fr 1fr"} gap={4} mt={6}>
                        <GridItem>
                            <CardRoot bg={EURECA_COLORS.CINZA} h="40vh">
                                <CardBody overflowY="auto">
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                                        Placas a serem aprovadas:
                                    </Text>
                                    {resultsPlacasCriadas === null ? (
                                        <Text>Carregando...</Text>
                                    ) : resultsPlacasCriadas.length > 0 ? (
                                        <SimpleGrid columns={4} px={2} gapX={2} justifyItems={"stretch"}>
                                            <For each={resultsPlacasCriadas}>
                                                {(item) => <CardPlaca placa={item}></CardPlaca>}
                                            </For>
                                        </SimpleGrid>
                                    ) : (
                                        <Text>Nenhuma placa encontrada.</Text>
                                    )}
                                </CardBody>
                            </CardRoot>
                        </GridItem>
                        <GridItem>
                            <CardRoot bg={EURECA_COLORS.CINZA} h="40vh">
                                <CardBody overflowY="auto">
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                                        Gerar Placas:
                                    </Text>
                                    <Text fontSize="sm" fontWeight="lighter">
                                        Escreva a lista de períodos (separados por vírgula) para os quais deseja gerar as placas
                                    </Text>
                                    <Input placeholder="Ex.: 2021.1,2021.2" bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black" onChange={(e) => setListaPeriodosParaCriarPlacas(e.target.value)}></Input>
                                    <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO} marginTop={"2"} onClick={handleCreatePlacasEspecificas}>Gerar placas</Button>
                                    <Text fontSize="sm" fontWeight="lighter" marginTop={"5"}>
                                        Gerar placas para todos períodos de seu curso que ainda não possuem uma na plataforma.
                                    </Text>
                                    <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO}>Gerar todas as placas restantes</Button>
                                </CardBody>
                            </CardRoot>
                        </GridItem>
                        <GridItem>
                            <CardRoot bg={EURECA_COLORS.CINZA} h="40vh">
                                <CardBody overflowY="auto">
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                                        Placas aprovadas:
                                    </Text>
                                    {resultsPlacasCriadas === null ? (
                                        <Text>Carregando...</Text>
                                    ) : resultsPlacasCriadas.length > 0 ? (
                                        <SimpleGrid columns={4} px={2} gapX={2} justifyItems={"stretch"}>
                                            <For each={resultsPlacasCriadas}>
                                                {(item) => <CardPlaca placa={item}></CardPlaca>}
                                            </For>
                                        </SimpleGrid>
                                    ) : (
                                        <Text>Nenhuma placa encontrada.</Text>
                                    )}
                                </CardBody>
                            </CardRoot>
                        </GridItem>
                        <GridItem>
                            <CardRoot bg={EURECA_COLORS.CINZA} h="40vh">
                                <CardBody overflowY="auto">
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                                        Placas criadas:
                                    </Text>
                                    {resultsPlacasCriadas === null ? (
                                        <Text>Carregando...</Text>
                                    ) : resultsPlacasCriadas.length > 0 ? (
                                        <SimpleGrid columns={4} px={2} gapX={2} justifyItems={"stretch"}>
                                            <For each={resultsPlacasCriadas}>
                                                {(item) => <CardPlaca placa={item}></CardPlaca>}
                                            </For>
                                        </SimpleGrid>
                                    ) : (
                                        <Text>Nenhuma placa encontrada.</Text>
                                    )}
                                </CardBody>
                            </CardRoot>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
        </Box>
        </>
    );
};

export default CoordinatorHome;
