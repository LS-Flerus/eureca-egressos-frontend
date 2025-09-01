import { Box, Image, Center, Spinner, SimpleGrid} from "@chakra-ui/react";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getImageFromMongoDB } from "@/service/imageService";
import { EstudanteResponse } from "@/interfaces/ServiceResponses";
import { LuPersonStanding, LuUserRound } from "react-icons/lu";

type EstudanteFotoVisualizadorPlacaProps = {
    estudante: EstudanteResponse
}

const EstudanteFotoVisualizadorPlaca = ({estudante}: EstudanteFotoVisualizadorPlacaProps) => {
        const [img,setImg] = useState("")

// -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------    
        const getImage = async () => {
            console.log(estudante)
            const image = await getImageFromMongoDB(estudante.photoId);
            setImg(image);
            return image;
        }

        if(!!estudante.photoId && (!img || img == "")) {
            getImage()
        }
// -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
    return (
        <>
            { !estudante.photoId ?  
                <Box boxSize="160px"
                    bgColor={EURECA_COLORS.CINZA_CLARO}
                    borderRadius="full"
                    objectFit="cover"
                    border={`2px solid ${EURECA_COLORS.AZUL_ESCURO}`}
                    mt={6}
                    overflow={"hidden"}>
                    <Center>
                        <SimpleGrid columns={1}mt={2}>
                            <LuUserRound size={"xl"} color={EURECA_COLORS.AZUL_ESCURO}/>
                        </SimpleGrid>
                    </Center>
                </Box> : img ?
                (<Image
                    src={img}
                    alt={estudante.name}
                    boxSize="160px"
                    borderRadius="full"
                    objectFit="cover"
                    border={`2px solid ${EURECA_COLORS.AZUL_ESCURO}`}
                    mt={6}
                />) : (
                <Box boxSize="160px"
                    bgColor={EURECA_COLORS.CINZA_CLARO}
                    borderRadius="full"
                    objectFit="cover"
                    border={`2px solid ${EURECA_COLORS.AZUL_ESCURO}`}
                    mt={6}>
                    <Center>
                        <Spinner size={"xl"} color={EURECA_COLORS.AZUL_ESCURO}/>
                    </Center>
                </Box>) }
            </>
    )
};

export default EstudanteFotoVisualizadorPlaca;