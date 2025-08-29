import { Box, Image, Center, Spinner} from "@chakra-ui/react";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";
import { getImageFromMongoDB } from "@/service/imageService";

type FotosVisualizadorPlacaProps = {
    idImage: string
}

const FotosVisualizadorPlaca = ({idImage}: FotosVisualizadorPlacaProps) => {
        const [img,setImg] = useState("")

// -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------    
        const getImage = async () => {
            const image = await getImageFromMongoDB(idImage);
            setImg(image);
            return image;
        }

        if(!img || img == "") {
            getImage()
        }
// -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
    return (
        <Box
            outline="solid"
            bgColor={EURECA_COLORS.CINZA_CLARO}
            display="inline-block"
            overflow="hidden"
        >
            {img ? (
            <Image
                src={img}
                maxH="45vh"
                maxW="80vh"
                objectFit="contain"
                alt="Visualização da imagem"
            />
            ) : (
            <Center minW="10vh" minH="10vh" p={4}>
                <Spinner size="xl" color={EURECA_COLORS.AZUL_ESCURO} />
            </Center>
            )}
        </Box>
    );
};

export default FotosVisualizadorPlaca;