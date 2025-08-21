import { Box, Center, Flex, For, IconButton, SimpleGrid, Text, Image } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { LuArrowBigLeft, LuChevronLeft } from "react-icons/lu";
import { Separator } from "@chakra-ui/react";
import escudoUfcg from "@/assets/escudo-ufcg-big.png"

import { EURECA_COLORS } from "@/util/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPlacasById } from "@/service/placasService";
import { useEffect, useState } from "react";
import { PlacaResponse } from "@/interfaces/ServiceResponses";
import { getEstudatesByPlacaId } from "@/service/estudantesService";
import { getSessoesByPlacaId } from "@/service/sessoesPlacaService";

const VisualizadorPlaca = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const [placaInfo, setPlacaInfo] = useState<PlacaResponse|null>(null)

    const {data: dataPlaca, isLoading: isPlacaLoading} = useQuery({
        queryKey: ["dataPlacaById", {id: id}],
        queryFn: ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id:string} ];
            return getPlacasById(id)
        }
    })

    const {data: dataEstudantes, isLoading: isEstudantesLoading} = useQuery({
        queryKey: ["dataEstudanteByPlacaId", {id: id}],
        queryFn: ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id:string} ];
            return getEstudatesByPlacaId(id)
        }
    })

    const {data: dataSessoes, isLoading: isSessoesLoading } = useQuery({
        queryKey: ["dataSessoesByPlacaId", {id: id}],
        queryFn: ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id:string}];
            return getSessoesByPlacaId(id)
        }
    })


    useEffect(() => {
        if(!!dataPlaca) {
            setPlacaInfo(dataPlaca)
        }
    }, [dataPlaca]);
    
    // mock de estudantes só pra layout (depois você substitui pelo backend)
    const estudantes = [
        { id: 1, nome: "Maria Silva" },
        { id: 2, nome: "João Souza" },
        { id: 3, nome: "Ana Costa" },
        { id: 4, nome: "Pedro Oliveira" },
        { id: 5, nome: "Lucas Lima" },
        { id: 6, nome: "Carla Santos" },
    ];

    function goBack(){
        navigate(`/egressos/`)
    }

  return (
    <Box h="100vh" overflowY="auto" p={8}>
      {/* seta de voltar */}
      <Flex align="center" mb={4}>
        <IconButton onClick={()=>goBack()} rounded={"full"} size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
            <LuChevronLeft />
        </IconButton>
      </Flex>

      {/* Card principal */}
      <Center>
        <CardRoot bg={EURECA_COLORS.CINZA} w="80%" minH="70vh">
            {isPlacaLoading && isEstudantesLoading && isSessoesLoading? (
                <Text>Carregando...</Text>
            ) : (
                <CardBody>
                    {/* Nome da turma */}
                    <Center>
                    <Text fontSize="2xl" fontWeight="bold">
                        Nome da Turma
                    </Text>
                    </Center>

                    {/* linha separadora */}
                    <Separator my={4} />

                    {/* Avatares dos estudantes */}
                    <SimpleGrid columns={5} mt={-3}>
                    <For each={estudantes}>
                        {(estudante) => (
                        <Center flexDir="column">
                            <Image
                            src={escudoUfcg}
                            alt={estudante.nome}
                            boxSize="200px"
                            borderRadius="full"
                            objectFit="cover"
                            border={`2px solid ${EURECA_COLORS.AZUL_ESCURO}`}
                            mt={6}
                            />
                            <Text mt={2} textAlign="center">
                            {estudante.nome}
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

export default VisualizadorPlaca;