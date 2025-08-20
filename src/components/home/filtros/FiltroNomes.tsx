import { Box, Input } from "@chakra-ui/react";
import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { useEffect, useState } from "react";

const FiltroNomes = () => {
    const [nomeAluno, setNomeAluno] = useState<string>();
    const [nomeTurma, setNomeTurma] = useState<string>();

    useEffect(() => {
        console.log("Nome no imput de aluno:", nomeAluno);
        sessionStorage.setItem(SESSION_STORAGE.NOME_ALUNO, JSON.stringify(nomeAluno)) 
    }, [nomeAluno]);

    useEffect(() => {
        console.log("Nome no imput da turma:", nomeTurma);
        sessionStorage.setItem(SESSION_STORAGE.NOME_TURMA, JSON.stringify(nomeTurma)) 
    }, [nomeTurma]);

    return (
        <Box display={"flex"} pt={"2vh"} spaceX={"10"}>
            <Input placeholder="Pesquisar nome de aluno..." bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black" onChange={(e) => setNomeAluno(e.target.value)}></Input>
            <Input placeholder="Pesquisar nome de turma..." bg={EURECA_COLORS.CINZA_CLARO} _placeholder={{ color: "gray.500", opacity: 1 }} color="black" onChange={(e) => setNomeTurma(e.target.value)}></Input>
        </Box>
    );
};

export default FiltroNomes;
