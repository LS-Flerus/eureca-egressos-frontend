import { Box, Button, For, Grid, GridItem, IconButton,  Image, Spinner, Text, Textarea} from "@chakra-ui/react";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { GetPhotoResponse, GetUsuariosResponse, SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import {  LuTrash } from "react-icons/lu";
import { CreatePhotoPayload, CreatePlaqueSessionPayload } from "@/interfaces/ServicePayloads";
import { createPlaqueSession, deletePlaqueSession, getSessoesByPlacaId } from "@/service/sessoesPlacaService";
import { deleteImageMongoDB, getImageFromMongoDB, uploadImageMongoDB } from "@/service/imageService";
import { createFoto, getFotosByPlacaId, updateFoto } from "@/service/fotosService";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "../ui/file-upload";
import { toaster } from "../ui/toaster";
import { error } from "console";
import FotosVisualizadorPlaca from "../visualizadorPlaca/FotosVisualizadorPlaca";

const FotosEdicao = () => {
    const [nomeSessao, setNomeSessao] = useState("");

    const [sessoesPlacas, setSessoesPlacas] = useState<SessoesPlacaResponse[]>([])
    const [conteudoSessao, setConteudoSessao] = useState<string>("")

    const [fotoPrincipal, setFotoPrincipal] = useState<GetPhotoResponse>()
    const [imgPrincipal,setImgPrincipal] = useState("")
    const [fotosSecundarias, setFotosSecundarias] = useState<GetPhotoResponse[]>()
    const [listaUploadImgSecundarias, setListaUploadImgSecundarias] = useState("")
    const [imgSecundarias, setImgSecundarias] = useState([""])

// -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------

    const {data: dataAllPhotos, isLoading: isDataAllPhotosLoading} = useQuery({
        queryKey: ["dataGetAllPhotos"],
        queryFn: async () => {
            const egressosProfile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            const todasAsFotos = await getFotosByPlacaId(egressosProfile.plaqueId)
            const fotoGeral = todasAsFotos.filter((f: GetPhotoResponse) => f.mainPhoto);
            setFotoPrincipal(fotoGeral[0])
            const fotosAdicionais = todasAsFotos.filter((f: GetPhotoResponse) => !f.mainPhoto);;
            setFotosSecundarias(fotosAdicionais)
            console.log(todasAsFotos)

            return todasAsFotos;
        }
    })
    
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
    }, [fotoPrincipal, isDataAllPhotosLoading]);

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
        console.log(e)
        const file = e.acceptedFiles[0]
        
        const conversionResult: string | ArrayBuffer | null | undefined = await imagebase64(file)
        if(typeof conversionResult === "string") {
            const image: string = conversionResult
            setImgPrincipal(image)
            console.log(imgPrincipal)
        }

    }

    const submitImagemPrincipalMutation = useMutation({
        mutationKey: ["fotoPrincipalDaPlaca"],
        mutationFn: uploadImageMongoDB,
        onSuccess: (data) => {
            console.log(data)
            setImgPrincipal(data.image)
            toaster.create({
                            title: "Ação concluída",
                            description: "A imagem principal da placa foi alterada",
                            type: "success"
                        });
            let payloadAtualizarFoto = fotoPrincipal;
            payloadAtualizarFoto.photoId = data._id;
            console.log
            updateImgFotoPrincipalMutation.mutate(payloadAtualizarFoto)
        },
        onError: (error) => {
            console.log(error)
            toaster.create({
                            title: "Ação falhou",
                            description: "Algo deu errado. Tente novamente mais tarde",
                            type: "error"
                        });
        }
    })

    const updateImgFotoPrincipalMutation = useMutation({
        mutationKey: ["atualizaFotoPrincipalDaPlaca"],
        mutationFn: updateFoto,
        onSuccess: (data) => {
            console.log(data)
            setFotoPrincipal(data)
            toaster.create({
                            title: "Ação concluída",
                            description: "A imagem principal da placa foi alterada",
                            type: "success"
                        });
        },
        onError: (error) => {
            console.log(error)
            toaster.create({
                            title: "Ação falhou",
                            description: "Algo deu errado. Tente novamente mais tarde",
                            type: "error"
                        });
        }
    })

    const deleteImagemPrincipalMutation = useMutation({
        mutationKey: ["deletaImagemPrincipalDaPlaca"],
        mutationFn: deleteImageMongoDB,
        onSuccess: (data) => {
        },
        onError: (error) => {
            console.log(error)
            toaster.create({
                            title: "Ação falhou",
                            description: "Algo deu errado. Tente novamente mais tarde",
                            type: "error"
                        });
        }
    })

    const handleSubmitImagemPrincipal = async () => {
        if(!!fotoPrincipal && fotoPrincipal.photoId != '') {
            deleteImagemPrincipalMutation.mutate(fotoPrincipal.photoId);
        }
        submitImagemPrincipalMutation.mutate(imgPrincipal);
    }

    const handleUploadImagemExtra = async (e: any) => {
        console.log(e.acceptedFiles[0])
        const file = e.acceptedFiles[0]
        
        const conversionResult: string | ArrayBuffer | null | undefined = await imagebase64(file)
        if(typeof conversionResult === "string") {
            const image: string = conversionResult
            setListaUploadImgSecundarias(image)
            console.log(imgPrincipal)
        }
    }

    const handleSubmitImagemExtra = async () => {
        try {
            const egressosProfile: GetUsuariosResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_PROFILE));
            const novaImagem = await uploadImageMongoDB(listaUploadImgSecundarias);
            const payload: CreatePhotoPayload = {
                plaqueId: egressosProfile.plaqueId,
                photoId: novaImagem._id,
                mainPhoto: false
            }
            let novaFoto = await createFoto(payload);
            console.log(novaFoto)
            setFotosSecundarias([...fotosSecundarias,novaFoto])
            toaster.create({
                title: "Operação bem sucedida!",
                description: "Recarregue a página para atualizar a interface",
                type: "success"
            });
        } catch (error) {
            console.log(error)
            toaster.create({
                title: "Falha na operação",
                description: "Tente novamente mais tarde",
                type: "error"
            });
        }
    }
// -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
    return (
        <Grid templateColumns="1fr" gap={4} mt={2} mb={6}>
            <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Adicionar fotos
                    </Text>

                    <Grid templateColumns="1fr 1fr" gap={4}>
                        <GridItem>
                            <Box mb={3}>
                                <Text mb={1}>Atualizar foto principal da placa:</Text>
                                <FileUploadRoot alignItems="stretch" maxFiles={1} onFileChange={handleUploadImagemPrincipal}>
                                    <FileUploadDropzone w={"36vw"} h={"36vh"}
                                        label="Faça o upload da foto da turma inteira"
                                        description=".png ou .jpg de até 5MB"
                                        bgColor={"black/50"}
                                        cursor={"pointer"}
                                    />
                                    <FileUploadList/>
                                </FileUploadRoot>
                            </Box>

                            <Button
                            colorScheme="blue"
                            mt={2}
                            bg={EURECA_COLORS.AZUL_ESCURO}
                            color={EURECA_COLORS.BRANCO}
                            onClick={handleSubmitImagemPrincipal}
                            >
                            Atualizar foto
                            </Button>
                        </GridItem>
                        <GridItem>
                            <Box mb={3}>
                                <Text mb={1}>Adicionar fotos extras:</Text>
                                <FileUploadRoot alignItems="stretch" maxFiles={1} onFileChange={handleUploadImagemExtra}>
                                    <FileUploadDropzone w={"36vw"} h={"36vh"}
                                        label="Faça o upload da foto da turma inteira"
                                        description=".png ou .jpg de até 5MB"
                                        bgColor={"black/50"}
                                        style={{ cursor: "pointer" }}
                                        cursor={"pointer"}
                                    />
                                    <FileUploadList/>
                                </FileUploadRoot>
                            </Box>

                            <Button
                            colorScheme="blue"
                            mt={2}
                            bg={EURECA_COLORS.AZUL_ESCURO}
                            color={EURECA_COLORS.BRANCO}
                            onClick={handleSubmitImagemExtra}
                            >
                            Adicionar foto
                            </Button>
                        </GridItem>

                    </Grid>
                    
                </Box>
            </GridItem>
            <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Galeria
                </Text>

                <>
                    <Box display="flex" flexWrap="wrap" gap={6} justifyContent="flex-start">
                        <Box mb={3}>
                            <Text mb={1}>Foto principal:</Text>
                            { imgPrincipal ? (
                                <Box outline={"solid"} bgColor={EURECA_COLORS.CINZA_CLARO} h={"45vh"} w={"80vh"} overflow={"hidden"}>
                                    <Image src={imgPrincipal} />
                                </Box>
                                ) : (<Spinner />) }
                        </Box>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={6} justifyContent="flex-start">
                        <Box mb={3}>
                            <Text mb={1}>Fotos extras:</Text>
                            { fotosSecundarias ? (
                                <For each={fotosSecundarias}>
                                    {(foto) => (<FotosVisualizadorPlaca idImage={foto.photoId}/>)}
                                </For>
                                ) : (<Spinner />) }
                        </Box>
                    </Box>
                </>
                
                </Box>
            </GridItem>
        </Grid>
    );
};

export default FotosEdicao;