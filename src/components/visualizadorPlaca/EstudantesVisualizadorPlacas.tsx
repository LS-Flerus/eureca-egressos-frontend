import { Box, Center, Flex, For, IconButton, SimpleGrid, Text, Image, Spinner } from "@chakra-ui/react";
import escudoUfcg from "@/assets/escudo-ufcg-big.png"

import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { EstudanteResponse, GetPhotoResponse, GetUsuariosResponse, PlacaResponse, SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { getFotosByPlacaId } from "@/service/fotosService";
import { getImageFromMongoDB } from "@/service/imageService";
import EstudanteFotoVisualizadorPlaca from "./EstudanteFotoVisualizadorPlacas";

type EstudantesVisualizadorPlacaProps = {
    dataEstudantes: EstudanteResponse[];
}

const EstudantesVisualizadorPlaca = ({dataEstudantes}: EstudantesVisualizadorPlacaProps) => {
        const [nomeSessao, setNomeSessao] = useState("");
    
        const [sessoesPlacas, setSessoesPlacas] = useState<SessoesPlacaResponse[]>([])
        const [conteudoSessao, setConteudoSessao] = useState<string>("")
    
        const [fotoPrincipal, setFotoPrincipal] = useState<GetPhotoResponse>()
        const [imgPrincipal,setImgPrincipal] = useState("")
        const [fotosSecundarias, setFotosSecundarias] = useState<GetPhotoResponse[]>()
        const [imgSecundarias, setImgSecundarias] = useState("")
        
    const navigate = useNavigate();
    let { id } = useParams();

    function goBack(){
        navigate(`/egressos/`)
    }

    // -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
        const {data: dataAllPhotos, isLoading: isDataAllPhotosLoading} = useQuery({
            queryKey: ["dataGetAllPhotosDestaPlaca", {id: id}],
            queryFn: async () => {
                const todasAsFotos = await getFotosByPlacaId(id)
                const fotoGeral = todasAsFotos.filter((f: GetPhotoResponse) => f.mainPhoto);
                setFotoPrincipal(fotoGeral[0])
                const fotosAdicionais = todasAsFotos.filter((f: GetPhotoResponse) => !f.mainPhoto);;
                setFotosSecundarias(fotosAdicionais)
                console.log(todasAsFotos)
    
                return todasAsFotos;
            }
        })
        
        const getImagemPrincipalMutation = useMutation({
            mutationKey: ["fotoPrincipalDaPlacaDestaPlaca", {id: id}],
            mutationFn: getImageFromMongoDB,
            onSuccess: (data) => {
                setImgPrincipal(data)
            }
        })
    
        useEffect(() => {
            if ((!imgPrincipal || imgPrincipal === "") &&!isDataAllPhotosLoading &&fotoPrincipal) {
                if (fotoPrincipal.photoId === "") {
                    setImgPrincipal("");
                } else {
                    getImagemPrincipalMutation.mutate(fotoPrincipal.photoId);
                }
            }
        }, [fotoPrincipal, isDataAllPhotosLoading]);

    // -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------

    return (
        <SimpleGrid columns={5} mt={-3}>
            <For each={dataEstudantes}>
                {(estudante) => (
                <Center flexDir="column">
                    <EstudanteFotoVisualizadorPlaca estudante={estudante}/>
                    <Text mt={2} textAlign="center">
                    {estudante.name}
                    </Text>
                </Center>
                )}
            </For>
        </SimpleGrid>
    );
};

export default EstudantesVisualizadorPlaca;