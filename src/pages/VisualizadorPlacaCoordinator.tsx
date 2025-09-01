import { Box, Center, Flex, For, IconButton, SimpleGrid, Text, Image, Button } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { LuArrowBigLeft, LuChevronLeft } from "react-icons/lu";
import { Separator } from "@chakra-ui/react";
import escudoUfcg from "@/assets/escudo-ufcg-big.png"

import { EURECA_COLORS } from "@/util/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlacasById, updatePlaque } from "@/service/placasService";
import { useEffect, useState } from "react";
import { EstudanteResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { getEstudatesByPlacaId } from "@/service/estudantesService";
import { getSessoesByPlacaId } from "@/service/sessoesPlacaService";
import { UpdatePlaquePayload } from "@/interfaces/ServicePayloads";
import { toaster } from "@/components/ui/toaster";

const VisualizadorPlacaCoordinator = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const [placaInfo, setPlacaInfo] = useState<PlacaResponse|null>(null)
    const [aprovacaoModificada, setAprovacaoModificada] = useState(false)

    const {data: dataPlaca, isLoading: isPlacaLoading} = useQuery({
        queryKey: ["dataPlacaById", {id: id}],
        queryFn: ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id:string} ];
            return getPlacasById(id)
        }
    })

    const {data: dataEstudantes, isLoading: isEstudantesLoading} = useQuery({
        queryKey: ["dataEstudanteByPlacaId", {id: id}],
        queryFn: async ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id:string} ];
            const estudantes = await getEstudatesByPlacaId(id);

            return estudantes.sort((a: EstudanteResponse, b: EstudanteResponse) =>
                a.name.localeCompare(b.name)
            );
        }
    })

    const {data: dataSessoes, isLoading: isSessoesLoading } = useQuery({
        queryKey: ["dataSessoesByPlacaId", {id: id}],
        queryFn: ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id:string}];
            return getSessoesByPlacaId(id)
        }
    })

    const aprovarMutation = useMutation({
        mutationKey: ["aprovarPlaca"],
        mutationFn: updatePlaque,
        onSuccess: (data) => {
            toaster.create({
                title: "Ação concluída",
                description: "O status da placa foi atualizado com sucesso",
                type: "description"
            });
        },
        onError: (error) => {
          console.log(error)
        },
    });

    const handleAprovacao = (aprovado: boolean) => {
        const payload: UpdatePlaquePayload = placaInfo;
        payload.toApprove = false;
        setAprovacaoModificada(true)
        payload.approved = aprovado;
        aprovarMutation.mutate(payload)
    }

    useEffect(() => {
        if(!!dataPlaca) {
            setPlacaInfo(dataPlaca)
        }
    }, [dataPlaca]);

    function goBack(){
        navigate(`/egressos/coordenador`)
    }

  return (
    <Box h="100vh" overflowY="auto" p={8}>
      <Flex align="center" mb={4}>
        <IconButton onClick={()=>goBack()} size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
            <LuChevronLeft />
        </IconButton>
        <Flex gap={2} ml="auto">
            <Button bg="red" size="xl" color={EURECA_COLORS.BRANCO} onClick={() => {handleAprovacao(false)}} disabled={aprovacaoModificada || !placaInfo?.toApprove}>
                Rejeitar
            </Button>
            <Button bg="green" size="xl" color={EURECA_COLORS.BRANCO} onClick={() => {handleAprovacao(true)}} disabled={aprovacaoModificada || !placaInfo?.toApprove}>
                Aprovar
            </Button>
        </Flex>
      </Flex>

      <Center>
        <CardRoot bg={EURECA_COLORS.CINZA} w="80%" minH="70vh">
            {isPlacaLoading && isEstudantesLoading && isSessoesLoading? (
                <Text>Carregando...</Text>
            ) : (
                <CardBody>
                    <Center>
                    <Text fontSize="2xl" fontWeight="bold">
                        {placaInfo ? placaInfo.className : "Carregando..."}
                    </Text>
                    </Center>

                    <Separator my={4} />

                    <SimpleGrid columns={5} mt={-3}>
                    <For each={dataEstudantes}>
                        {(estudante) => (
                        <Center flexDir="column">
                            <Image
                            src={escudoUfcg}
                            alt={estudante.name}
                            boxSize="200px"
                            borderRadius="full"
                            objectFit="cover"
                            border={`2px solid ${EURECA_COLORS.AZUL_ESCURO}`}
                            mt={6}
                            />
                            <Text mt={2} textAlign="center">
                            {estudante.name}
                            </Text>
                        </Center>
                        )}
                    </For>
                    </SimpleGrid>
                </CardBody>
            )}
        </CardRoot>
      </Center>
    </Box>
  );
};

export default VisualizadorPlacaCoordinator;