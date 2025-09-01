import { Box, Collapsible, Input, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardRoot } from "@chakra-ui/react/card";
import { DIMENSOES, EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";

const FiltroPeriodo = () => {
    const [open, setOpen] = useState(false);

    const [periodoInicio, setPeriodoInicio] = useState<string>();
    const [periodoFim, setPeriodoFim] = useState<string>();

    useEffect(() => {
        console.log("Periodo inicial da pesquisa", periodoInicio);
        sessionStorage.setItem(SESSION_STORAGE.PERIODO_INICIO, periodoInicio) 
    }, [periodoInicio]);

    useEffect(() => {
        console.log("Periodo final da pesquisa", periodoFim);
        sessionStorage.setItem(SESSION_STORAGE.PERIODO_FIM, periodoFim) 
    }, [periodoFim]);
      
  return (
    <CardRoot size="sm" cursor="pointer" bg={EURECA_COLORS.AZUL_MEDIO}>
        <CardBody cursor="pointer">
            <Collapsible.Root >
            <Collapsible.Trigger
                paddingY="3"
                alignContent="center"
                w="full"
                cursor={"pointer"}
                onClick={() => setOpen(!open)}
            >
            <Text fontSize="xl">Período de conclusão</Text>
          </Collapsible.Trigger>
            <Collapsible.Content h={DIMENSOES.ALTURA_FILTROS} alignItems={"center"}>
              <Box padding="4" 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center"
                h="100%"
                >
                
                <Text>Período de início</Text>
                <Input placeholder="Ex.: 2021.1" bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black" onChange={(e) => setPeriodoInicio(e.target.value)}></Input>
                
                <Text pt={"5vh"}>Período de início</Text>
                <Input placeholder="Ex.: 2023.2" bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black" onChange={(e) => setPeriodoFim(e.target.value)}></Input>
              </Box>
            </Collapsible.Content>
        </Collapsible.Root>
      </CardBody>
    </CardRoot>
  );
};

export default FiltroPeriodo;
