import { Box, Button, createListCollection, Grid, GridItem, IconButton, Input, Text, Textarea} from "@chakra-ui/react";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { GetEurecaProfileResponse, GetPhotoResponse, GetUsuariosResponse, PlacaResponse, SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlacasByCurso } from "@/service/placasService";
import {  LuTrash } from "react-icons/lu";
import { createUser, deleteUser, getUsuariosByCurso } from "@/service/userService";
import { CreatePlaqueSessionPayload, CreateUserPayload } from "@/interfaces/ServicePayloads";
import { createPlaqueSession, deletePlaqueSession, getSessoesByPlacaId } from "@/service/sessoesPlacaService";
import { getImageFromMongoDB, uploadImageMongoDB } from "@/service/imageService";
import { getFotosByPlacaId } from "@/service/fotosService";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "../ui/file-upload";

const FotosEdicao = () => {
    const [nomeSessao, setNomeSessao] = useState("");

    const [sessoesPlacas, setSessoesPlacas] = useState<SessoesPlacaResponse[]>([])
    const [conteudoSessao, setConteudoSessao] = useState<string>("")

    const [fotoPrincipal, setFotoPrincipal] = useState<GetPhotoResponse>()
    const [imgPrincipal,setImgPrincipal] = useState("")
    const [fotosSecundarias, setFotosSecundarias] = useState<GetPhotoResponse[]>()
    const [imgSecundarias, setImgSecundarias] = useState("")

    const {data: dataAllPhotos, isLoading: isDataAllPhotosLoading} = useQuery({
        queryKey: ["dataCreatedSectios"],
        queryFn: async () => {
            const egressosProfile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            const todasAsFotos = await getFotosByPlacaId(egressosProfile.plaqueId)
            const fotoGeral = todasAsFotos.filter((f: GetPhotoResponse) => f.mainPhoto);
            setFotoPrincipal(fotoGeral[0])
            const fotosAdicionais = todasAsFotos.filter((f: GetPhotoResponse) => !f.mainPhoto);;
            setFotosSecundarias(fotosAdicionais)

            return todasAsFotos;
        }
    })

    const {data: dataCreatedSectios, isLoading: isDataCreatedSectiosLoading} = useQuery({
        queryKey: ["dataCreatedSectios"],
        queryFn: async () => {
            const egressosProfile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            const todasSessoes = await getSessoesByPlacaId(egressosProfile.plaqueId)
            setSessoesPlacas(todasSessoes)

            return todasSessoes;
        }
    })


    const handleCreateSession = async () => {
        const egressosProfile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
        const payload: CreatePlaqueSessionPayload = {
            plaqueId:egressosProfile.plaqueId,
            content: conteudoSessao,
            name: nomeSessao,
            isList: false
        }
        createPlaqueSessionMutation.mutate(payload)
    }

    const createPlaqueSessionMutation = useMutation({
        mutationKey: ["getCreatedPlaquesByFilter"],
        mutationFn: createPlaqueSession,
        onSuccess: async (data) => {
            setSessoesPlacas([...sessoesPlacas,data])
        },
        onError: (error) => {
          console.log(error);
        },
    });

    const deletePlaqueSessionMutation = useMutation({
        mutationKey: ["getCreatedPlaquesByFilter"],
        mutationFn: deletePlaqueSession,
        onSuccess: async (data) => {
            const egressosProfile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            const todasSessoes = await getSessoesByPlacaId(egressosProfile.plaqueId)
            setSessoesPlacas(todasSessoes)
        },
        onError: (error) => {
          console.log(error);
        },
    });

// -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    const getImagemPrincipalMutation = useMutation({
        mutationKey: ["fotoPrincipalDaPlaca"],
        mutationFn: getImageFromMongoDB,
        onSuccess: (data) => {
            console.log(data)
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
    }, [fotoPrincipal, imgPrincipal, isDataAllPhotosLoading]);

    useEffect(() => {

    }, []);

    const imagebase64 = async (file: any): Promise<string | ArrayBuffer | null | undefined> => {
        const reader = new FileReader()
        if(file) {
        reader.readAsDataURL(file)
        const data: string | ArrayBuffer | null = await new Promise((resolve,reject) => {
            reader.onload = ()=> resolve(reader.result)
            reader.onerror = (err) => reject(err)
        })
        return data
        }
    }
    
    const handleUploadImagemPrincipal = async (e: any) => {
        console.log(e.acceptedFiles[0])
        const file = e.acceptedFiles[0]
        
        const conversionResult: string | ArrayBuffer | null | undefined = await imagebase64(file)
        if(typeof conversionResult === "string") {
            const image: string = conversionResult
            setImgPrincipal(image)
        }
    }

    const submitImagemPrincipalMutation = useMutation({
        mutationKey: ["fotoPrincipalDaPlaca"],
        mutationFn: uploadImageMongoDB,
        onSuccess: (data) => {
            console.log(data)
            setImgPrincipal(data)
        }
    })

    /*
    useEffect(() => {
        fetchImage()
    },[])
    */
// -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
    return (
        <Grid templateColumns="1fr" gap={4} mt={2}>
            <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Criar seção
                    </Text>

                    <Box mb={3}> 
                        <Text mb={1}>Nome da sessão:</Text> 
                        <Input value={nomeSessao} onChange={(e) => {setNomeSessao(e.target.value)}} placeholder="Ex.: Professores homenageados" bg={EURECA_COLORS.CINZA_CLARO} color={"black"}/> 
                    </Box>

                    <Box mb={3}>
                    <Text mb={1}>Conteúdo da sessão:</Text>
                    <FileUploadRoot alignItems="stretch" maxFiles={1} onFileChange={handleUploadImagemPrincipal}>
                        <FileUploadDropzone w={"36vw"} h={"36vh"}
                            label="Faça o upload da capa da sua campanha"
                            description=".png ou .jpg de até 5MB"
                        />
                        <FileUploadList/>
                    </FileUploadRoot>

                    </Box>

                    <Button
                    colorScheme="blue"
                    mt={2}
                    bg={EURECA_COLORS.AZUL_ESCURO}
                    color={EURECA_COLORS.BRANCO}
                    onClick={handleCreateSession}
                    >
                    Criar seção
                    </Button>
                </Box>
            </GridItem>
            <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Seções que você cadastrou
                </Text>

                {isDataCreatedSectiosLoading ? (
                    <Text>Carregando...</Text>
                ) : (<>
                    <Box as="table" width="100%">
                        <Box as="thead" bg={EURECA_COLORS.AZUL_ESCURO}>
                        <Box as="tr">
                            <Box as="th" textAlign="left" p={2}>Nome</Box>
                            <Box as="th" textAlign="left" p={2}>Conteudo</Box>
                            <Box as="th" p={2}></Box>
                        </Box>
                        </Box>
                        <Box as="tbody">
                        {sessoesPlacas?.map((sessao, idx) => (
                            <Box as="tr" key={idx} borderBottom="1px solid gray">
                            <Box as="td" p={2}>{sessao.name}</Box>
                            <Box as="td" p={2}>{sessao.content}</Box>
                            <Box as="td" p={2}>
                                <IconButton onClick={()=>deletePlaqueSessionMutation.mutate(sessao.id)} size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
                                    <LuTrash />
                                </IconButton>
                            </Box>
                            </Box>
                        ))}
                        </Box>
                    </Box>
                </>)}
                
                </Box>
            </GridItem>
        </Grid>
    );
};

export default FotosEdicao;