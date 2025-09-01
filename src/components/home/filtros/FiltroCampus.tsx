import { Box, Checkbox, CheckboxGroup, Collapsible, Fieldset, For, Text} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { DIMENSOES, EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCampi } from "@/service/filterService";

const FiltroCampus = () => {
    const [openCampus, setOpenCampus] = useState(false);
    const [campusSelecionados, setCampusSelecionados] = useState<string[]>([]);

    const {data: dataCampi, isLoading: isCampusLoading} = useQuery({
        queryKey: ["filtroCampi"],
        queryFn: getCampi
    })

    const handleCheckboxChange = (checked: boolean, value: string) => {
        setCampusSelecionados((prev) =>
            checked ? [...prev, value] : prev.filter((v) => v !== value)
        );
    };

    useEffect(() => {
            console.log("Checkbox campus marcadas:", campusSelecionados);
            sessionStorage.setItem(SESSION_STORAGE.CAMPI, campusSelecionados.join(",")) 
        }, [campusSelecionados]);

    return (
        <CardRoot size="sm" bg={EURECA_COLORS.AZUL_MEDIO}>
            <CardBody cursor="pointer">
                <Collapsible.Root >
                <Collapsible.Trigger
                    paddingY="3"
                    alignContent="center"
                    w="full"
                    cursor={"pointer"}
                    onClick={() => setOpenCampus(!openCampus)}
                >
                    <Text fontSize="xl">Campus</Text>
                </Collapsible.Trigger>
                    <Collapsible.Content h={DIMENSOES.ALTURA_FILTROS} overflowY={"auto"}>
                    <Box padding="4">
                        {isCampusLoading ? (
                            <Text>Carregando...</Text>
                        ) : (
                            <Fieldset.Root>
                            <CheckboxGroup name="campus">
                                <Fieldset.Content>
                                <For each={dataCampi}>
                                    {(value) => (
                                    <Checkbox.Root 
                                        key={value.campus} 
                                        value={value.descricao} 
                                        onCheckedChange={(details) => handleCheckboxChange(details.checked === true, value.campus+'')}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control cursor={"pointer"} borderColor={EURECA_COLORS.BRANCO}/>
                                        <Checkbox.Label>{value.descricao}</Checkbox.Label>
                                    </Checkbox.Root>
                                    )}
                                </For>
                                </Fieldset.Content>
                            </CheckboxGroup>
                            </Fieldset.Root>
                            )}
                    </Box>
                    </Collapsible.Content>
                </Collapsible.Root>
            </CardBody>
        </CardRoot>
)};

export default FiltroCampus;
