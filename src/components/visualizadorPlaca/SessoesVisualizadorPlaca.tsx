import { Box, Button, createListCollection, For, Grid, GridItem, IconButton, Input, Separator, Text, Textarea, VStack} from "@chakra-ui/react";
import { EURECA_COLORS, MAPEAMENTO_CAMPUS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { GetEurecaProfileResponse, GetUsuariosResponse, PlacaResponse, SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlacasByCurso } from "@/service/placasService";
import {  LuTrash } from "react-icons/lu";
import { createUser, deleteUser, getUsuariosByCurso } from "@/service/userService";
import { CreatePlaqueSessionPayload, CreateUserPayload } from "@/interfaces/ServicePayloads";
import { createPlaqueSession, deletePlaqueSession, getSessoesByPlacaId } from "@/service/sessoesPlacaService";
import { Curso } from "@/interfaces/Models";
import { getCourses } from "@/service/filterService";

type SessoesVisualizadorPlacaProps = {
    placa: PlacaResponse;
}

const SessoesVisualizadorPlaca = ({placa}: SessoesVisualizadorPlacaProps) => {

    const { data: sessoesPlacas, isLoading } = useQuery({
        queryKey: ["sessoesByPlacaId", placa.id],
        queryFn: () => getSessoesByPlacaId(placa.id),
    })

    const {data: dataCursos, isLoading: isCursosLoading} = useQuery({
            queryKey: ["filtroCursos"],
            queryFn: getCourses
        })
    

    const mapCourseCodeToName = () => {
        const courseData = dataCursos.filter((currentCourse) => String(currentCourse.codigo_do_curso) === placa.courseCode);
        return courseData[0].descricao + " [" + placa.courseCode + "]";
    }

  return (
    <Box display="flex" flexWrap="wrap" gap={6} justifyContent="flex-start">
        <Box
            bg={EURECA_COLORS.CINZA_CLARO}
            p={6}
            rounded="2xl"
            shadow="sm"
            borderWidth="1px"
        >
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={2}
              color={EURECA_COLORS.AZUL_ESCURO}
            >
              Campus
            </Text>
            <Separator mb={3} />
            <Text whiteSpace="pre-line" color={EURECA_COLORS.AZUL_ESCURO}>{MAPEAMENTO_CAMPUS[placa.campus+'']}</Text>
        </Box>
        {!isCursosLoading ? (
            <Box
                bg={EURECA_COLORS.CINZA_CLARO}
                p={6}
                rounded="2xl"
                shadow="sm"
                borderWidth="1px"
            >
                <Text
                fontSize="xl"
                fontWeight="bold"
                mb={2}
                color={EURECA_COLORS.AZUL_ESCURO}
                >
                    Curso
                </Text>
                <Separator mb={3} />
                <Text whiteSpace="pre-line" color={EURECA_COLORS.AZUL_ESCURO}>{mapCourseCodeToName()}</Text>
            </Box>
        ):(<></>)}
        {isLoading ? <Text>Carregando seções...</Text> :
            <>{
                !sessoesPlacas || sessoesPlacas.length === 0 ? <></> :(
                    <For each={sessoesPlacas}>
                        {(sessao: SessoesPlacaResponse) => (
                            <Box
                                bg={EURECA_COLORS.CINZA_CLARO}
                                p={6}
                                rounded="2xl"
                                shadow="sm"
                                borderWidth="1px"
                            >
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    mb={2}
                                    color={EURECA_COLORS.AZUL_ESCURO}
                                >
                                {sessao.name}
                                </Text>
                                <Separator mb={3} />
                                <Text whiteSpace="pre-line" color={EURECA_COLORS.AZUL_ESCURO}>{sessao.content}</Text>
                            </Box>
                        )}
                    </For>
                )
            }</>
        }
    </Box>
  )
};

export default SessoesVisualizadorPlaca;