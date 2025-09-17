import { Box, Button, Center, Flex, For, Grid, Image, SimpleGrid, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useReducer, useRef, useState } from "react";
import FiltroCurso from "@/components/home/filtros/FiltroCurso";
import FiltroPeriodo from "@/components/home/filtros/FiltroPeriodo";
import FiltroCampus from "@/components/home/filtros/FiltroCampus";
import FiltroNomes from "@/components/home/filtros/FiltroNomes";
import { useMutation } from "@tanstack/react-query";
import { getPlacasByFilter } from "@/service/placasService";
import { FiltersPayload } from "@/interfaces/ServicePayloads";
import { CardPlaca } from "@/components/home/CardPlaca";
import { PlacaResponse } from "@/interfaces/ServiceResponses";
import { LoginPopUp } from "@/components/home/LoginPopUp";
import { toaster } from "@/components/ui/toaster";

const Home = () => {

    const [results, setResults] = useState<PlacaResponse[] | null>(null);
    const [showResultsCard, setShowResultsCard] = useState(false);
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const [,forceUpdate] = useReducer(x=>x+1,0);
  
    const handleSubmitButton = async () => {
        const payload: FiltersPayload = {
            courseCode: sessionStorage.getItem(SESSION_STORAGE.CURSOS) || null,
            startSemester: sessionStorage.getItem(SESSION_STORAGE.PERIODO_INICIO) || null,
            endSemester: sessionStorage.getItem(SESSION_STORAGE.PERIODO_FIM) || null,
            className: sessionStorage.getItem(SESSION_STORAGE.NOME_TURMA) || null,
            campus: sessionStorage.getItem(SESSION_STORAGE.CAMPI) || null,
            approved: null,
            toApprove: null,
            studentName: sessionStorage.getItem(SESSION_STORAGE.NOME_ALUNO) || null,
        };
        console.log(payload)
        setResults([])
        toaster.create({
            title: "Carregando placas...",
            type: "info",
        });
        getPlaquesByFilter.mutate(payload)
     };

    const getPlaquesByFilter = useMutation({
        mutationKey: ["getPlaquesByFilter"],
        mutationFn: getPlacasByFilter,
        onSuccess: (data) => {
            toaster.dismiss()
            setResults(data); 
            setShowResultsCard(true);
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: "smooth" }); 
            }
        },
        onError: (error) => {
            toaster.dismiss()
            toaster.create({
                title: "Falha na busca",
                description: "Tente novamente mais tarde",
                type: "error"
            });
            console.log(error);
        },
    });

    return (
        <>
            <Box h={"100vh"} overflowY={"auto"}>
                <Box pl={"15vh"} pt={"5vh"} pr={"15vh"}>
                    <Flex justify="space-between" align="center">
                        <Flex pl="8vh" gap="4" align="center">
                            <Image src="src/assets/escudo-ufcg.png" />
                            <Image src="src/assets/eureca_egressos_logo.png" />
                        </Flex>
                        <LoginPopUp />
                    </Flex>

                    <Box display={"flex"} pt={"4vh"} spaceX={"24"}>
                        <CardRoot className="margin-top" bg={EURECA_COLORS.CINZA}>
                            <CardBody>
                                <Text fontSize={"md"}>Bem-vindo ao Eureca Egressos! Aqui você pode conferir a versão digital das placas de concluintes dos egressos da UFCG.</Text>
                            </CardBody>
                        </CardRoot>
                        <Spacer />
                        <CardRoot className="margin-top" bg={EURECA_COLORS.CINZA}>
                            <CardBody>
                                <Text fontSize={"md"}>Caso seja um coordenador de curso ou parte de uma comissão de formatura, realize seu login no sistema para ter acesso à seu perfil.</Text>
                            </CardBody>
                        </CardRoot>
                    </Box>
                    <FiltroNomes />
                    <Box h={"48vh"}>
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

                    <Center>
                        <Button bg={EURECA_COLORS.AZUL_ESCURO} color={EURECA_COLORS.BRANCO} alignSelf={"center"} onClick={handleSubmitButton}> 
                            <Text>
                                Pesquisar Placas
                            </Text>
                        </Button>
                    </Center>
                    
                    {showResultsCard && (
                        <Box ref={resultsRef} mt={6} h="80vh" mb={6}>
                            <CardRoot bg={EURECA_COLORS.CINZA} h="80vh" w="100%">
                            <CardBody>
                                <Text fontSize="lg" fontWeight="bold" mb={4}>
                                Resultados:
                                </Text>
                                <Box overflowY="auto" maxH="70vh" w="100%">
                                {results === null ? (
                                    <Text>Carregando...</Text>
                                ) : results.length > 0 ? (
                                    <SimpleGrid
                                    columns={4}
                                    px={2}
                                    gap={2}
                                    justifyItems="stretch"
                                    w="100%"
                                    >
                                    <For each={results}>
                                        {(item) => (
                                        <CardPlaca placa={item} />
                                        )}
                                    </For>
                                    </SimpleGrid>
                                ) : (
                                    <Text>Nenhuma placa encontrada.</Text>
                                )}
                                </Box>
                            </CardBody>
                            </CardRoot>
                        </Box>
)}
                </Box>
            </Box>
        </>
    );
};

export default Home;
