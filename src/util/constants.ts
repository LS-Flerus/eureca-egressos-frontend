export const ENDPOINTS = {
    CAMPI: "campi",
    CURSOS: "cursos",
    ESTUDANTE: "estudantes/estudante",

    PLACAS_FILTRO: "plaque/getByFilter",
    PLACAS_ID: "plaque/getById",
    PLACAS_ALL: "plaque/getAll",
    PLACAS_CRIAR: "plaque/create",
    PLACAS_CRIAR_FALTANTES: "",
    PLACAS_POR_CURSO: "plaque/getByCourseCode",
    PLACA_UPDATE: "plaque/update",

    ESTUDANTES_PLACA: "students/getAllByPlaqueId",
    ATUALIZAR_ESTUDANTE: "students/update",

    SESSOES_PLACA: "plaqueSessions/getAllByPlaque",
    CRIAR_SESSAO: "plaqueSessions/create",
    DELETAR_SESSAO: "plaqueSessions/delete",

    LOGIN: "authentication/authenticate",

    USUARIOS_POR_CURSO: "users/getAllByCourseCode",
    DELETAR_USUARIO: "users/delete",
    CRIAR_USUARIO: "users/create",
    USUARIO_POR_MATRICULA: "users/getUserByEnrollment",

    UPDATE_FOTO: "photos/update",
    CREATE_FOTO: "photos/create",
    DELETE_FOTO: "photos/delete",
    GET_FOTO: "photos/getById",
    GET_FOTO_PLACA: "photos/getAllByPlaque",

    GET_IMAGE_MONGO: "get",
    UPLOAD_IMAGE_MONGO: "upload",
    DELETE_IMAGE_MONGO: "delete"
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
    CURSOS_RESPONSE: "cursosResponse",
    PERIODO_INICIO: "periodoInicio",
    PERIODO_FIM: "periodoFim",
    NOME_TURMA: "nomeTurma",
    NOME_ALUNO: "nomeAluno",
    EURECA_TOKEN: "eurecaToken",
    EURECA_PROFILE: "eurecaProfile",
    EGRESSOS_TOKEN: "egressosToken",
    EGRESSOS_PROFILE: "egressosProfile",
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