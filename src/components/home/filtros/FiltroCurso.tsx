import { Box, Button, Center, Checkbox, CheckboxGroup, Collapsible, Fieldset, Flex, For, Grid, Image, Input, InputGroup, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardHeader, CardRoot, CardTitle } from "@chakra-ui/react/card";
import { DIMENSOES, EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/service/filterService";
import { Curso } from "@/interfaces/Models";
import { LuSearch } from "react-icons/lu";

const FiltroCurso = () => {
    const [open, setOpen] = useState(false);
    const [cursosSelecionados, setCursosSelecionados] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Curso; direction: "asc" | "desc" } | null>(null);
    const [search, setSearch] = useState("");

    const {data: dataCursos, isLoading} = useQuery({
        queryKey: ["filtroCursos"],
        queryFn: getCourses
    })

    const cursosFiltrados = useMemo(() => {
        if(!isLoading && !!dataCursos){
            sessionStorage.setItem(SESSION_STORAGE.CURSOS_RESPONSE,JSON.stringify(dataCursos))
            let cursos = [...dataCursos];

            if (search.trim()) {
                try {
                cursos = cursos.filter((curso) =>
                    curso.descricao.toLowerCase().includes(search.toLowerCase()) ||
                    (curso.codigo_do_curso+'').includes(search.toLowerCase()) 
                );
                } catch (e) {
                cursos = [];
                }
            }
        
            if (sortConfig) {
                cursos.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
        
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
                });
            }
        
            return cursos;
        }
      
    }, [dataCursos, search, sortConfig, isLoading]);

    const handleCheckboxChange = (checked: boolean, value: string) => {
        setCursosSelecionados((prev) =>
            checked ? [...prev, value] : prev.filter((v) => v !== value)
        );
    };

    useEffect(() => {
                console.log("Checkbox cursos marcadas:", cursosSelecionados);
                sessionStorage.setItem(SESSION_STORAGE.CURSOS, cursosSelecionados.join(",")) 
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
                <Collapsible.Content h={DIMENSOES.ALTURA_FILTROS} overflowY={"auto"}>
                <Box padding="4">
                    {isLoading ? (
                        <Text>Carregando...</Text>
                    ) : (
                        <>
                        <InputGroup pb={"2vh"} startElement={
                        <LuSearch/>}>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            bgColor={"white/85"}
                            placeholder="Buscar cursos..."
                        />
                        </InputGroup>
                        <Fieldset.Root>
                        <CheckboxGroup name="curso">
                            <Fieldset.Content>
                            <For each={cursosFiltrados}>
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
                        </>
                        )}
                </Box>
                </Collapsible.Content>
            </Collapsible.Root>
        </CardBody>
        </CardRoot>
    );
};

export default FiltroCurso;
