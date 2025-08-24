import { PlacaResponse } from "@/interfaces/ServiceResponses";
import { EURECA_COLORS, MAPEAMENTO_CAMPUS } from "@/util/constants";
import { Box, CardBody, CardHeader, CardRoot, Separator, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface CardPlacaProps {
    placa: PlacaResponse; 
}

export const CardPlacaCoordinator = ({
    placa, 
}: CardPlacaProps) => {
    
    const navigate = useNavigate();
    
    function navigatePaginaPlaca() {
        sessionStorage.setItem('placaVisualizadaId', placa.id);
        console.log(placa.id)
        navigate("/egressos/placa/"+placa.id);
    }

    const [img,setImg] = useState("")


    return(
        <Box pt={1}>
            <CardRoot className="margin-top" cursor={"pointer"} onClick={navigatePaginaPlaca} bgColor={EURECA_COLORS.BRANCO} color={"black"}>
                <CardHeader fontSize={"xl"} pl={"2"} pt={"1"}>
                    Turma: {placa.className}
                </CardHeader>
                <Separator></Separator>
                <CardBody pt={"1"} pl={"2"}>
                    <Text lineClamp={1} fontSize={"sm"}>Campus: {MAPEAMENTO_CAMPUS[placa.campus+'']}</Text>
                    <Text lineClamp={1} fontSize={"sm"}>Curso: {placa.courseCode}</Text>
                    <Text lineClamp={1} fontSize={"sm"}>Periodo de conclusão: {placa.semester}</Text>
                </CardBody>
            </CardRoot>
        </Box>
    )
}