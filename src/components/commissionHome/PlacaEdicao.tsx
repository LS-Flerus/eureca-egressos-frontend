import { Box, Center, Flex, For, IconButton, SimpleGrid, Text, Image } from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { Separator } from "@chakra-ui/react";

import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPlacasById } from "@/service/placasService";
import { useEffect, useState } from "react";
import { EstudanteResponse, GetUsuariosResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { getEstudatesByPlacaId } from "@/service/estudantesService";
import EditableStudentPortrait from "./EditableStudentPortrait";

const PlacaEdicao = () => {

    const navigate = useNavigate();
    let { id } = useParams();
    const [placaInfo, setPlacaInfo] = useState<PlacaResponse|null>(null)

    const {data: dataPlaca, isLoading: isPlacaLoading} = useQuery({
        queryKey: ["dataPlacaByIdComissao"],
        queryFn: async() => {
            const profile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            return await getPlacasById(profile.plaqueId)
        }
    })

    const {data: dataEstudantes, isLoading: isEstudantesLoading} = useQuery({
        queryKey: ["dataEstudanteByPlacaIdComissao"],
        queryFn: async () => {
            const profile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            const estudantes = await getEstudatesByPlacaId(profile.plaqueId);

            console.log(estudantes)
            return estudantes.sort((a: EstudanteResponse, b: EstudanteResponse) =>
                a.name.localeCompare(b.name)
            );
        }
    })

    useEffect(() => {
        if(!!dataPlaca) {
            setPlacaInfo(dataPlaca)
        }
    }, [dataPlaca]);

    function goBack(){
        navigate(`/egressos/`)
    }

  return (
    <Box h="100vh" p={8}>

      <Center>
        <CardRoot bg={EURECA_COLORS.CINZA} w="80%" minH="50vh" mb={6}>
            {isPlacaLoading && isEstudantesLoading ? (
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
                                <EditableStudentPortrait estudante={estudante}/>
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
}

export default PlacaEdicao;