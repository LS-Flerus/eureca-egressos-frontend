import { Box, Button, Flex, Tabs } from "@chakra-ui/react";

import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useNavigate } from "react-router-dom";
import { LuCamera, LuFolder, LuUser } from "react-icons/lu";
import PlacaEdicao from "@/components/commissionHome/PlacaEdicao";

const CommissionHome = () => {

    const navigate = useNavigate();

    const handleLogOut = () => {
        sessionStorage.removeItem(SESSION_STORAGE.EURECA_PROFILE);
        sessionStorage.removeItem(SESSION_STORAGE.EURECA_TOKEN);
        navigate("/egressos/")
    }

    return (
        <Box h={"100vh"} overflowY={"auto"}>
            <Box pl="15vh" pt="5vh" pr="15vh">
                <Flex justify="space-between" align="center">
                    <Tabs.Root defaultValue="placa" variant="plain" w="100%">
                        <Flex justify="space-between" align="center" mb={0}>
                            <Tabs.List
                                display="flex"
                                gap={2}
                                bgColor={EURECA_COLORS.AZUL_ESCURO}
                                color={EURECA_COLORS.BRANCO}
                                p={1}
                                rounded="l3"
                            >
                                <Tabs.Trigger value="placa">
                                <LuFolder />
                                Placa
                                </Tabs.Trigger>
                                <Tabs.Trigger value="sessoes">
                                <LuUser />
                                Sessões
                                </Tabs.Trigger>
                                <Tabs.Trigger value="fotos">
                                <LuCamera />
                                Fotos
                                </Tabs.Trigger>
                                <Tabs.Indicator rounded="l2" bgColor={EURECA_COLORS.AZUL_MEDIO} />
                            </Tabs.List>

                            <Button
                                bg={EURECA_COLORS.AZUL_ESCURO}
                                size="xl"
                                color={EURECA_COLORS.BRANCO}
                                onClick={handleLogOut}
                            >
                                Sair
                            </Button>
                        </Flex>

                        <Tabs.Content value="placa" mt={0}>
                            <PlacaEdicao />
                        </Tabs.Content>
                        <Tabs.Content value="sessoes" mt={0}>

                        </Tabs.Content>
                        <Tabs.Content value="fotos" mt={0}>

                        </Tabs.Content>
                    </Tabs.Root>
                </Flex>
            </Box>
        </Box>
    );
};

export default CommissionHome;
