import { Box, Center, Flex, For, IconButton, SimpleGrid, Text, Image, Spinner } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { LuArrowBigLeft, LuChevronLeft } from "react-icons/lu";
import { Separator } from "@chakra-ui/react";
import escudoUfcg from "@/assets/escudo-ufcg-big.png"

import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlacasById } from "@/service/placasService";
import { useEffect, useState } from "react";
import { EstudanteResponse, GetPhotoResponse, GetUsuariosResponse, PlacaResponse, SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { getEstudatesByPlacaId } from "@/service/estudantesService";
import { getSessoesByPlacaId } from "@/service/sessoesPlacaService";
import { getFotosByPlacaId } from "@/service/fotosService";
import { getImageFromMongoDB } from "@/service/imageService";
import SessoesVisualizadorPlaca from "@/components/visualizadorPlaca/SessoesVisualizadorPlaca";

const VisualizadorPlaca = () => {
        const [nomeSessao, setNomeSessao] = useState("");
    
        const [sessoesPlacas, setSessoesPlacas] = useState<SessoesPlacaResponse[]>([])
        const [conteudoSessao, setConteudoSessao] = useState<string>("")
    
        const [fotoPrincipal, setFotoPrincipal] = useState<GetPhotoResponse>()
        const [imgPrincipal,setImgPrincipal] = useState("")
        const [fotosSecundarias, setFotosSecundarias] = useState<GetPhotoResponse[]>()
        const [imgSecundarias, setImgSecundarias] = useState("")
        
    const navigate = useNavigate();
    let { id } = useParams();
    const [placaInfo, setPlacaInfo] = useState<PlacaResponse|null>(null)

    const {data: dataPlaca, isLoading: isPlacaLoading} = useQuery({
        queryKey: ["dataPlacaByIdComissao", {id}],
        queryFn: ({ queryKey }) => {
            const [_key, { id }] = queryKey as [string, {id: string}];
            return getPlacasById(id);
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


    useEffect(() => {
        if(!!dataPlaca) {
            setPlacaInfo(dataPlaca)
        }
    }, [dataPlaca]);

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
    <Box h="100vh" overflowY="auto" p={8}>
      <Flex align="center" mb={4}>
        <IconButton onClick={()=>goBack()} size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
            <LuChevronLeft />
        </IconButton>
      </Flex>

      <Center>
        <CardRoot bg={EURECA_COLORS.CINZA} w="80%" minH="70vh" shadow="xl">
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
                    <Box mb={3}>
                        <Center>
                            <Box outline={"solid"} bgColor={EURECA_COLORS.CINZA_CLARO} h={"45vh"} w={"80vh"} overflow={"hidden"}>
                                { imgPrincipal ? (<Image src={imgPrincipal} />) : (<Center><Spinner size={"xl"} color={EURECA_COLORS.AZUL_ESCURO}/></Center>) }
                            </Box>
                        </Center>
                    </Box>
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

                    <Center>
                        <Box pt={10}>{isPlacaLoading ? <Spinner /> : <SessoesVisualizadorPlaca placa={dataPlaca}/>}</Box>
                    </Center>
                    
                </CardBody>
            )}
        </CardRoot>
      </Center>
    </Box>
  );
};

export default VisualizadorPlaca;