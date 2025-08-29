import { Box, Button, Combobox, createListCollection, For, Grid, GridItem, IconButton, Input, ListCollection, Menu, MenuContent, MenuItem, MenuRoot, MenuTrigger, Portal, Select, SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText, SimpleGrid, Text, useListCollection} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { GetEurecaProfileResponse, GetUsuariosResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPlacasEspecificas, getPlacasByCurso, getPlacasByFilter } from "@/service/placasService";
import { CardPlacaCoordinator } from "@/components/coordinatorHome/CardPlacaCoordinatorHome";
import { useNavigate } from "react-router-dom";
import { LuCog, LuTrash } from "react-icons/lu";
import { createUser, deleteUser, getUsuariosByCurso } from "@/service/userService";
import { CreateUserPayload } from "@/interfaces/ServicePayloads";
import { getStudentFromDasByEnrollment } from "@/service/eurecaService";
import { toaster } from "../ui/toaster";

const AbaUsuarios = () => {
    const [usuarios, setUsuarios] = useState<GetUsuariosResponse[]>([]);
    const [nome, setNome] = useState("");
    const [enrollment, setEnrollment] = useState("");
    const [senha, setSenha] = useState("");
    const [placaSelecionada, setPlacaSelecionada] = useState("");
    const [resultsPlacasCriadas, setResultsPlacasCriadas] = useState<PlacaResponse[]>([]);
    const [placasMapeadas, setPlacasMapeadas] = useState<PlacasIdPeriodo[]>([]);
    const [mapeamentoColection, setMapeamentoColection] = useState(
        createListCollection<{ label: string; value: string }>({
            items: [],
        })
    )
    const [flagFetchData, setFlagFetchData] = useState<boolean>(false)
    const [selectValue, setSelectValue] = useState<string>("")

    type PlacasIdPeriodo = {
        id: string,
        periodo: string
    }

    const {data: dataPlacasCriadas, isLoading: isPlacasCriadasLoading} = useQuery({
        queryKey: ["dataPlacasCriadas"],
        queryFn: async () => {
            const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
            const courseCode = String(eurecaProfile.attributes.code)
            const todasPlacas = await getPlacasByCurso(courseCode)
            setResultsPlacasCriadas(todasPlacas)

            return todasPlacas;
        }
    })

    const {data: dataUsuarios, isLoading: isUsuariosLoading} = useQuery({
        queryKey: ["dataUsuariosCriados"],
        queryFn: async () => {
            const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
            const courseCode = String(eurecaProfile.attributes.code)
            const todosUsuarios = await getUsuariosByCurso(courseCode)
            setUsuarios(todosUsuarios)
            return todosUsuarios;
        }
    })

    useEffect(() => {
        if (dataUsuarios && dataPlacasCriadas && !flagFetchData) {
            let mapeamento: PlacasIdPeriodo[] = []
            for(let placaAtual of dataPlacasCriadas) {
                mapeamento.push({
                    id: placaAtual.id,
                    periodo: placaAtual.semester
                })
            }
            
            const collection = createListCollection({
                items: mapeamento.map(placa => ({
                    label: placa.periodo,
                    value: placa.id,
                })),
            })
            
            setMapeamentoColection(collection)
            setPlacasMapeadas(mapeamento);
            console.log(usuarios)
            setFlagFetchData(true)
        }
    }),[dataUsuarios,dataPlacasCriadas]

    const handleDeleteUser = async (userId: string) => {
        await deleteUser(userId);
        const eurecaProfile: GetEurecaProfileResponse = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.EURECA_PROFILE));
        const courseCode = String(eurecaProfile.attributes.code)
        const todosUsuarios = await getUsuariosByCurso(courseCode)
        setUsuarios(todosUsuarios)
    }

    const handleCreateUser = async () => {
        try {
            console.log(sessionStorage.getItem(SESSION_STORAGE.EURECA_TOKEN))
            const student = await getStudentFromDasByEnrollment(enrollment)
            let payload: CreateUserPayload = {
                name: student.nome,
                enrollment: student.matricula_do_estudante,
                courseCode: String(student.codigo_do_curso),
                plaqueId: selectValue
            }
            console.log(payload)
            const novoUsuario = await createUser(payload)
            setUsuarios([...usuarios,novoUsuario])
        } catch (error) {
            console.log(error);
            toaster.create({
            title: "Falha na operação",
            description: "Certifique-se de que essa é uma matrícula válida de um estudante do seu curso",
            type: "error"
            });
        }
    }

    return (
        <>
            <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%" mb={4}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Criar usuário
                </Text>
                <Text fontSize="sm" fontWeight="lighter">
                    Escreva a matrícula de estudante que deseja atribuir à comissão de uma placa específica. Isso dará ao estudante a capacidade de logar com suas credenciais do SCAO para editar a placa atribuída.
                </Text>
                <Box mb={3}>
                    <Text mb={1}>Matrícula:</Text>
                    <Input value={enrollment} onChange={(e) => setEnrollment(e.target.value)} placeholder="Ex.: 121113333" bg={EURECA_COLORS.CINZA_CLARO} color={"black"}/>
                </Box>

                <Box mb={3}>
                    <Text mb={1}>Placa:</Text>
                    <SelectRoot mt={2} collection={mapeamentoColection} onValueChange={({ value }) => {setSelectValue(value[0]); console.log(value[0])}}>
                        <SelectTrigger bg={EURECA_COLORS.CINZA_CLARO}>
                            <SelectValueText placeholder="Período" color={"black"}/>
                        </SelectTrigger>
                        <SelectContent>
                            {mapeamentoColection.items.map((type) => (
                            <SelectItem item={type} key={String(type.value)}>
                                {type.label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>
                </Box>

                <Button colorScheme="blue" mt={2} bg={EURECA_COLORS.AZUL_ESCURO} color={EURECA_COLORS.BRANCO} onClick={handleCreateUser}>
                    Criar Usuário
                </Button>
                </Box>
                <Box bg={EURECA_COLORS.CINZA} p={4} borderRadius="lg" h="100%">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Usuários que você cadastrou
                </Text>

                {isUsuariosLoading || isPlacasCriadasLoading ? (
                    <Text>Carregando...</Text>
                ) : (<>
                    <Box as="table" width="100%">
                        <Box as="thead" bg={EURECA_COLORS.AZUL_ESCURO}>
                        <Box as="tr">
                            <Box as="th" textAlign="left" p={2}>Nome</Box>
                            <Box as="th" textAlign="left" p={2}>Matrícula</Box>
                            <Box as="th" textAlign="left" p={2}>Período da Placa</Box>
                            <Box as="th" p={2}></Box>
                        </Box>
                        </Box>
                        <Box as="tbody">
                        {usuarios?.map((user, idx) => (
                            <Box as="tr" key={idx} borderBottom="1px solid gray">
                            <Box as="td" p={2}>{user.name}</Box>
                            <Box as="td" p={2}>{placasMapeadas.find(m => m.id === user.plaqueId)?.periodo || "-"}</Box>
                            <Box as="td" p={2}>
                                <IconButton onClick={()=>handleDeleteUser(user.id)} size={"xl"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}> 
                                    <LuTrash />
                                </IconButton>
                            </Box>
                            </Box>
                        ))}
                        </Box>
                    </Box>
                </>)}
            
            </Box>
        </>
    );
};

export default AbaUsuarios;