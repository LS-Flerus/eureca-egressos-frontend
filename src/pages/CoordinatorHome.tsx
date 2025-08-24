import { Box, Button, Flex, For, Grid, GridItem, Image, Input, SimpleGrid, Text} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { CardPlaca } from "@/components/home/CardPlaca";
import { GetEurecaProfileResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPlacasEspecificas, getPlacasByCurso, getPlacasByFilter } from "@/service/placasService";
import { CardPlacaCoordinator } from "@/components/coordinatorHome/CardPlacaCoordinatorHome";
import { useNavigate } from "react-router-dom";

const CoordinatorHome = () => {

    const navigate = useNavigate();

    const [resultsPlacasCriadas, setResultsPlacasCriadas] = useState<PlacaResponse[]>([]);
    const [placasAprovadas, setPlacasAprovadas] = useState<PlacaResponse[]>([]);
    const [placasSeremAprovadas, setPlacasSeremAprovadas] = useState<PlacaResponse[]>([]);
    const [listaPeriodosParaCriarPlacas, setListaPeriodosParaCriarPlacas] = useState<string>();

    const {data: dataPlacasCriadas, isLoading: isPlacasCriadasLoading} = useQuery({
        queryKey: ["dataPlacasCriadas"],
        queryFn: async () => {
            const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
            const courseCode = String(eurecaProfile.attributes.code)
            const todasPlacas = await getPlacasByCurso(courseCode)
            const placasAprovadas = todasPlacas.filter((p: PlacaResponse) => p.approved);
            setPlacasAprovadas(placasAprovadas)
            const placasSeremAprovadas = todasPlacas.filter((p: PlacaResponse) => p.toApprove);
            console.log(todasPlacas)
            setPlacasSeremAprovadas(placasSeremAprovadas)

            return todasPlacas;
        }
    })

    useEffect(() => {
        if (dataPlacasCriadas) {
            setResultsPlacasCriadas(dataPlacasCriadas);
            
        }
    }, [dataPlacasCriadas]);

    
    const createSpecificPlaques = useMutation({
        mutationKey: ["getCreatedPlaquesByFilter"],
        mutationFn: createPlacasEspecificas,
        onSuccess: async (data) => {
            const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
            const courseCode = String(eurecaProfile.attributes.code)
            const placasCriadas = await getPlacasByFilter({courseCode: courseCode})
            setResultsPlacasCriadas(placasCriadas);
        },
        onError: (error) => {
          console.log(error);
        },
    });
    
    const handleCreatePlacasEspecificas = async () => {
        const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
        const courseCode = String(eurecaProfile.attributes.code)
        createSpecificPlaques.mutate({periodos: listaPeriodosParaCriarPlacas, codigoDeCurso: courseCode})
    };

    const handleLogOut = () => {
        sessionStorage.removeItem(SESSION_STORAGE.EURECA_PROFILE);
        sessionStorage.removeItem(SESSION_STORAGE.EURECA_TOKEN);
        navigate("/egressos/")
    }

    return (
        <>
        <Box h={"100vh"} overflowY={"auto"}>
            <Box pl={"15vh"} pt={"5vh"} pr={"15vh"}>
                <Flex justify="space-between" align="center">
                    <Flex pl="8vh" gap="4" align="center">

                    </Flex>
                    <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO} onClick={handleLogOut}>Sair</Button>
                </Flex>
                <Box mt={6} h="50vh">
                    <Grid templateColumns={"1fr 1fr"} gap={4} mt={6}>
                        <GridItem>
                            <CardRoot bg={EURECA_COLORS.CINZA} h="40vh">
                                <CardBody overflowY="auto">
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                                        Placas a serem aprovadas:
                                    </Text>
                                    {isPlacasCriadasLoading ? (
                                        <Text>Carregando...</Text>
                                    ) : resultsPlacasCriadas && resultsPlacasCriadas.length > 0 ? (
                                        <SimpleGrid columns={2} px={2} gapX={2} justifyItems="stretch">
                                            <For each={placasSeremAprovadas}>
                                                {(item) => <CardPlacaCoordinator placa={item} />}
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
                                    {isPlacasCriadasLoading ? (
                                        <Text>Carregando...</Text>
                                    ) : resultsPlacasCriadas && resultsPlacasCriadas.length > 0 ? (
                                        <SimpleGrid columns={2} px={2} gapX={2} justifyItems="stretch">
                                            <For each={placasAprovadas}>
                                                {(item) => <CardPlacaCoordinator placa={item} />}
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
                                    {isPlacasCriadasLoading ? (
                                        <Text>Carregando...</Text>
                                    ) : resultsPlacasCriadas && resultsPlacasCriadas.length > 0 ? (
                                        <SimpleGrid columns={2} px={2} gapX={2} justifyItems="stretch">
                                            <For each={resultsPlacasCriadas}>
                                                {(item) => <CardPlacaCoordinator placa={item} />}
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
