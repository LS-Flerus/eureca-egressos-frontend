import { Box, Button, Grid, GridItem, IconButton,  Image, Spinner, Text, Textarea} from "@chakra-ui/react";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { GetPhotoResponse, GetUsuariosResponse, SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import {  LuTrash } from "react-icons/lu";
import { CreatePlaqueSessionPayload } from "@/interfaces/ServicePayloads";
import { createPlaqueSession, deletePlaqueSession, getSessoesByPlacaId } from "@/service/sessoesPlacaService";
import { deleteImageMongoDB, getImageFromMongoDB, uploadImageMongoDB } from "@/service/imageService";
import { getFotosByPlacaId, updateFoto } from "@/service/fotosService";
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from "../ui/file-upload";
import { toaster } from "../ui/toaster";
import { error } from "console";

const FotosEdicao = () => {
    const [nomeSessao, setNomeSessao] = useState("");

    const [sessoesPlacas, setSessoesPlacas] = useState<SessoesPlacaResponse[]>([])
    const [conteudoSessao, setConteudoSessao] = useState<string>("")

    const [fotoPrincipal, setFotoPrincipal] = useState<GetPhotoResponse>()
    const [imgPrincipal,setImgPrincipal] = useState("")
    const [fotosSecundarias, setFotosSecundarias] = useState<GetPhotoResponse[]>()
    const [imgSecundarias, setImgSecundarias] = useState("")

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
        console.log(e.acceptedFiles[0])
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
// -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    
    return (
        <Grid templateColumns="1fr" gap={4} mt={2}>
            <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Foto principal
                    </Text>

                    <Grid templateColumns="1fr 1fr" gap={4}>
                        <GridItem>
                            <Box mb={3}>
                                <Text mb={1}>Atualizar foto da placa:</Text>
                                <FileUploadRoot alignItems="stretch" maxFiles={1} onFileChange={handleUploadImagemPrincipal}>
                                    <FileUploadDropzone w={"36vw"} h={"36vh"}
                                        label="Faça o upload da foto da turma inteira"
                                        description=".png ou .jpg de até 5MB"
                                        bgColor={"black/50"}
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
                                <Text mb={1}>Foto atual:</Text>
                                { imgPrincipal ? (<Image src={imgPrincipal} />) : (<Spinner />) }
                            </Box>

                        </GridItem>
                    </Grid>
                    
                </Box>
            </GridItem>
            <GridItem>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Enviar fotos adicionais
                </Text>

                <>
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
                                <IconButton size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
                                    <LuTrash />
                                </IconButton>
                            </Box>
                            </Box>
                        ))}
                        </Box>
                    </Box>
                </>
                
                </Box>
            </GridItem>
        </Grid>
    );
};

export default FotosEdicao;