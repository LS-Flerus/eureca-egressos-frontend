import { Box, CardBody, CardRoot, CardTitle, Text } from "@chakra-ui/react";
import { EURECA_COLORS } from "@/util/constants";
import { useState } from "react";
import { Collapsible } from "@chakra-ui/react";

const FiltroCampus = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <CardRoot size={"sm"} cursor={"pointer"} bg={EURECA_COLORS.AZUL_MEDIO}>
      <CardBody>
        <Collapsible.Root>
          <Collapsible.Trigger
            paddingY="3"
            alignContent={"center"}
            w={"full"}
            onClick={() => handleToggle(0)}
          >
            <Text fontSize={"xl"}>Campus</Text>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Box padding="4" borderWidth="1px">
              {openIndex === 0 && <Text>Conteúdo do Campus</Text>}
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      </CardBody>
    </CardRoot>
  );
}; 

export default FiltroCampus; 
