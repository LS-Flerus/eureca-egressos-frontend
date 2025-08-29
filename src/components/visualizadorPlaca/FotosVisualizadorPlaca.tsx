import { Box, Image, Center, Spinner} from "@chakra-ui/react";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getImageFromMongoDB } from "@/service/imageService";

type FotosVisualizadorPlacaProps = {
    idImage: string
}

const FotosVisualizadorPlaca = ({idImage}: FotosVisualizadorPlacaProps) => {
        const [img,setImg] = useState("")

// -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------    
        const {data: dataAllPhotos, isLoading: isDataImage} = useQuery({
            queryKey: ["getImageForPhotoCard"],
            queryFn: async () => {
                const image = await getImageFromMongoDB(idImage);
                setImg(image);
                return image;
            }
        })
// -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
    return (
        <Box outline={"solid"} bgColor={EURECA_COLORS.CINZA_CLARO} h={"45vh"} w={"80vh"} overflow={"hidden"}>
            { img ? (<Image src={img} />) : (<Center><Spinner size={"xl"} color={EURECA_COLORS.AZUL_ESCURO}/></Center>) }
        </Box>
    )
};

export default FotosVisualizadorPlaca;