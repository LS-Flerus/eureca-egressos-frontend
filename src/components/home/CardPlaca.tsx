import { PlacaResponse } from "@/interfaces/ServiceResponses";
import { getCourses } from "@/service/filterService";
import { EURECA_COLORS, MAPEAMENTO_CAMPUS } from "@/util/constants";
import { Box, CardBody, CardHeader, CardRoot, Separator, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface CardPlacaProps {
    placa: PlacaResponse; 
}

export const CardPlaca = ({
    placa, 
}: CardPlacaProps) => {
    
    const [nomeCurso,setNomeCurso] = useState("")
    const navigate = useNavigate();
    
    function navigatePaginaPlaca() {
        sessionStorage.setItem('placaVisualizadaId', placa.id);
        console.log(placa.id)
        navigate("/egressos/placa/"+placa.id);
    }

    const [img,setImg] = useState("")

    const {data: dataCursos, isLoading} = useQuery({
        queryKey: ["filtroCursos"],
        queryFn: getCourses
    })

    useEffect(() => {
        if(!isLoading) {      
            const courseData = dataCursos.filter((currentCourse) => String(currentCourse.codigo_do_curso) === placa.courseCode);
            setNomeCurso(courseData[0].descricao + " [" + placa.courseCode + "]")
        }
    },[isLoading])

    return(
        <Box pt={1}>
        <CardRoot className="margin-top" cursor={"pointer"} onClick={navigatePaginaPlaca} bgColor={EURECA_COLORS.BRANCO} color={"black"}>
            <CardHeader fontSize={"xl"} pl={"2"} pt={"1"}>
                Turma: {placa.className}
            </CardHeader>
            <Separator></Separator>
            <CardBody pt={"1"} pl={"2"}>
                <Text lineClamp={1} fontSize={"sm"}>Campus: {MAPEAMENTO_CAMPUS[placa.campus+'']}</Text>
                <Text lineClamp={1} fontSize={"sm"}>Curso: {nomeCurso}</Text>
                <Text lineClamp={1} fontSize={"sm"}>Periodo de conclusão: {placa.semester}</Text>
            </CardBody>
        </CardRoot>
        </Box>
    )
}