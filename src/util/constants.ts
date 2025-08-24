export const ENDPOINTS = {
    CAMPI: "campi",
    CURSOS: "cursos",

    PLACAS_FILTRO: "plaque/getByFilter",
    PLACAS_ID: "plaque/getById",
    PLACAS_ALL: "plaque/getAll",
    PLACAS_CRIAR: "",
    PLACAS_CRIAR_FALTANTES: "",
    PLACAS_POR_CURSO: "plaque/getByCourseCode",
    PLACA_UPDATE: "plaque/update",

    ESTUDANTES_PLACA: "students/getAllByPlaqueId",
    SESSOES_PLACA: "plaqueSessions/getAllByPlaque",

    LOGIN: "authentication/authenticate"
}

export const EURECA_COLORS = {
    AZUL_ESCURO: "#00205B",
    AZUL_MEDIO: "#1A4E8A",
    AZUL_CLARO: "#3D87CB",
    CIANO: "#00BCE1",
    BRANCO: "#F6FAFC",
    CINZA: "#4B4F54",
    CINZA_CLARO: "#CECECE"
} as const;

export const SESSION_STORAGE = {
    CAMPI: "campi",
    CURSOS: "cursos",
    PERIODO_INICIO: "periodoInicio",
    PERIODO_FIM: "periodoFim",
    NOME_TURMA: "nomeTurma",
    NOME_ALUNO: "nomeAluno",
    EURECA_TOKEN: "eurecaToken",
    EURECA_PROFILE: "eurecaProfile"
}

export const DIMENSOES = {
    ALTURA_FILTROS: "30vh"
}

export const MAPEAMENTO_CAMPUS = {
    "1": "Campina Grande",
    "2": "Cajazeiras",
    "3": "Sousa",
    "4": "Patos",
    "5": "Cuité",
    "7": "Sumé",
    "9": "Pombal",
}