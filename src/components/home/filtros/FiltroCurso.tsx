import { Box, Button, Center, Checkbox, CheckboxGroup, Collapsible, Fieldset, Flex, For, Grid, Image, Input, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardHeader, CardRoot, CardTitle } from "@chakra-ui/react/card";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/service/filterService";

const FiltroCurso = () => {
    const [open, setOpen] = useState(false);
    const [cursosSelecionados, setCursosSelecionados] = useState<string[]>([]);

    const {data: dataCursos, isLoading} = useQuery({
        queryKey: ["filtroCursos"],
        queryFn: getCourses
    })

    const handleCheckboxChange = (checked: boolean, value: string) => {
        setCursosSelecionados((prev) =>
            checked ? [...prev, value] : prev.filter((v) => v !== value)
        );
    };

    useEffect(() => {
                console.log("Checkbox cursos marcadas:", cursosSelecionados);
                sessionStorage.setItem(SESSION_STORAGE.CURSOS, JSON.stringify(cursosSelecionados)) 
            }, [cursosSelecionados]);

    return (
        <CardRoot size="sm" bg={EURECA_COLORS.AZUL_MEDIO}>
        <CardBody cursor="pointer">
            <Collapsible.Root >
            <Collapsible.Trigger
                paddingY="3"
                alignContent="center"
                w="full"
                cursor={"pointer"}
                onClick={() => setOpen(!open)}
            >
                <Text fontSize="xl">Curso</Text>
            </Collapsible.Trigger>
            {open && (
                <Collapsible.Content maxHeight={"28vh"} overflowY={"auto"}>
                <Box padding="4">
                    {isLoading ? (
                        <Text>Carregando...</Text>
                    ) : (
                        <Fieldset.Root>
                        <CheckboxGroup name="curso">
                            <Fieldset.Content>
                            <For each={dataCursos}>
                                {(value) => (
                                <Checkbox.Root 
                                    key={value.codigo_do_curso} 
                                    value={value.descricao+` - `+value.codigo_do_curso}
                                    onCheckedChange={(details) => handleCheckboxChange(details.checked === true, value.codigo_do_curso+'')}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control cursor={"pointer"} borderColor={EURECA_COLORS.BRANCO}/>
                                    <Checkbox.Label>{value.descricao} - {value.codigo_do_curso}</Checkbox.Label>
                                </Checkbox.Root>
                                )}
                            </For>
                            </Fieldset.Content>
                        </CheckboxGroup>
                        </Fieldset.Root>
                        )}
                </Box>
                </Collapsible.Content>
            )}
            </Collapsible.Root>
        </CardBody>
        </CardRoot>
    );
};

export default FiltroCurso;
