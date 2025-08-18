import { Box, Button, Center, Collapsible, Flex, Grid, Image, Input, Spacer, Text} from "@chakra-ui/react";
import { CardBody, CardHeader, CardRoot, CardTitle } from "@chakra-ui/react/card";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";

const FiltroCurso = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <>
        <CardRoot size={"sm"} cursor={"pointer"} bg={EURECA_COLORS.AZUL_MEDIO}>
            <CardBody>
                <Collapsible.Root flex={"1"} >
                    <Collapsible.Trigger paddingY="3" alignContent={"center"} w={"full"} onClick={() => handleToggle(0)}>
                        <Text fontSize={"xl"}>Curso</Text>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                    <Box padding="4" borderWidth="1px">
                        {openIndex === 0 && <Text>Conteúdo do Curso</Text>}
                    </Box>
                    </Collapsible.Content>
                </Collapsible.Root>
            </CardBody>
        </CardRoot>
    </>
  );
};

export default FiltroCurso;
