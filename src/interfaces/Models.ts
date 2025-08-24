export type Campus = {
    campus: number,
    descricao: string,
    representacao: string
}

export type Placa = {
    startSemester: string,
    endSemester: string,
    courseCode: string,
    className: string,
    approved: boolean,
    toApprove: boolean,
}

export type Curso = {
    codigo_do_curso: number,
    descricao: string,
    status: string,
    grau_do_curso: string,
    codigo_do_setor: number,
    nome_do_setor: string,
    campus: number,
    nome_do_campus: string,
    turno: string,
    periodo_de_inicio: string,
    data_de_funcionamento: string,
    codigo_inep: number,
    modalidade_academica: string,
    curriculo_atual: number,
    area_de_retencao: number,
    ciclo_enade: number
}