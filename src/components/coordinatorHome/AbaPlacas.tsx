import { Box, Button, For, Grid, GridItem, IconButton, Input, SimpleGrid, Text} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { GetEurecaProfileResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPlacasEspecificas, deletePlaque, getPlacasByCurso, getPlacasByFilter } from "@/service/placasService";
import { CardPlacaCoordinator } from "@/components/coordinatorHome/CardPlacaCoordinatorHome";
import { useNavigate } from "react-router-dom";
import { LuTrash } from "react-icons/lu";
import { CardPlaca } from "../home/CardPlaca";
import { Toaster, toaster } from "../ui/toaster";

const AbaPlacas = () => {

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
            toaster.dismiss()
            toaster.create({
                title: "Operação bem sucedida!",
                description: "Recarregue a página para atualizar a interface",
                type: "success"
            });
            const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
            const courseCode = String(eurecaProfile.attributes.code)
            const placasCriadas = await getPlacasByFilter({courseCode: courseCode})
            setResultsPlacasCriadas(placasCriadas);
        },
        onError: (error) => {7
            toaster.dismiss()
            toaster.create({
                title: "Falha na operação",
                description: "Tente novamente mais tarde",
                type: "error"
            });
            console.log(error);
        },
    });
    
    const handleCreatePlacasEspecificas = async () => {
        toaster.create({
            title: "Realizando operação...",
            type: "info",
        });
        const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
        const courseCode = String(eurecaProfile.attributes.code)
        createSpecificPlaques.mutate({periodos: listaPeriodosParaCriarPlacas, codigoDeCurso: courseCode})
    };

    const handleDeletePlaque = async (placaId: string) => {
        await deletePlaque(placaId);
        const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
        const courseCode = String(eurecaProfile.attributes.code)
        const todosUsuarios = await getPlacasByCurso(courseCode)
        setResultsPlacasCriadas(todosUsuarios)
    }

    return (
        <Box mt={6} h="50vh">
            <Grid templateColumns={"1fr 1fr"} gap={4} mt={6}>
                <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%" maxH={"30vh"} overflow={"auto"}>
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            Gerenciar placas:
                        </Text>
                    <Box as="table" width="100%">
                        <Box as="thead" bg={EURECA_COLORS.AZUL_ESCURO}>
                        <Box as="tr">
                            <Box as="th" textAlign="left" p={2}>Nome</Box>
                            <Box as="th" textAlign="left" p={2}>Período da Placa</Box>
                            <Box as="th" p={2}></Box>
                        </Box>
                        </Box>
                        <Box as="tbody" overflow={"auto"}>
                        {resultsPlacasCriadas?.map((placa, idx) => (
                            <Box as="tr" key={idx} borderBottom="1px solid gray">
                            <Box as="td" p={2}>{placa.className}</Box>
                            <Box as="td" p={2}>{placa.semester}</Box>
                            <Box as="td" p={2}>
                                <IconButton onClick={()=>handleDeletePlaque(placa.id)} size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
                                    <LuTrash />
                                </IconButton>
                            </Box>
                            </Box>
                        ))}
                        </Box>
                    </Box>
                </Box>
                </GridItem>
                
                <GridItem>
                    <CardRoot bg={EURECA_COLORS.CINZA} h="30vh">
                        <CardBody overflowY="auto">
                            <Text fontSize="lg" fontWeight="bold" mb={4}>
                                Gerar Placas:
                            </Text>
                            <Text fontSize="sm" fontWeight="lighter">
                                Escreva a lista de períodos (separados por vírgula) para os quais deseja gerar as placas
                            </Text>
                            <Input placeholder="Ex.: 2021.1,2021.2" bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black" onChange={(e) => setListaPeriodosParaCriarPlacas(e.target.value)}></Input>
                            <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO} marginTop={"2"} onClick={handleCreatePlacasEspecificas}>Gerar placas</Button>
                        </CardBody>
                    </CardRoot>
                </GridItem>
            </Grid>
            <CardRoot bg={EURECA_COLORS.CINZA} h="50vh" mt={3}>
                <CardBody overflowY="auto">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Placas criadas:
                    </Text>
                    {isPlacasCriadasLoading ? (
                        <Text>Carregando...</Text>
                    ) : resultsPlacasCriadas && resultsPlacasCriadas.length > 0 ? (
                        <SimpleGrid columns={4} px={2} gapX={2} justifyItems="stretch">
                            <For each={resultsPlacasCriadas}>
                                {(item) => <CardPlaca placa={item} />}
                            </For>
                        </SimpleGrid>
                    ) : (
                        <Text>Nenhuma placa encontrada.</Text>
                    )}
                </CardBody>
            </CardRoot>
            <Toaster/>
        </Box>
    );
};

export default AbaPlacas;
