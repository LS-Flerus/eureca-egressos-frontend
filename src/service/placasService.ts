import { ENDPOINTS } from "@/util/constants";
import { axiosBackend, axiosDAS } from "./axios";
import { Curso, Placa } from "@/interfaces/Models";
import { CreatePlaquePayload, FiltersPayload } from "@/interfaces/ServicePayloads";
import { PlacaResponse } from "@/interfaces/ServiceResponses";

export const getPlacasByFilter = async(payload: FiltersPayload) => {

    const params = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null && v !== "undefined")
    );

    const { data } = await axiosBackend.get<PlacaResponse[]> (
        `/${ENDPOINTS.PLACAS_FILTRO}`,
        { params }
    )
    return data;
}

export const getPlacasByCurso = async(courseCode: string) => {

    const { data } = await axiosBackend.get<PlacaResponse[]> (
        `/${ENDPOINTS.PLACAS_POR_CURSO}`,
        { 
            params: {
                courseCode: courseCode
            }
        }
    )
    return data;
}

export const getPlacasById = async(id: string) => {
    const { data } = await axiosBackend.get<PlacaResponse> (
        `/${ENDPOINTS.PLACAS_ID}`,
        {
            params: {
                id: id
            }
        }
    )
    return data;
}

export const getAllPlacas = async() => {
    const { data } = await axiosBackend.get<PlacaResponse[]> (
        `/${ENDPOINTS.PLACAS_ALL}`
    )
    return data;
}

export const createPlacasEspecificas = async(parameters: {periodos: string, codigoDeCurso: string}) => {
    const listaPeriodos = parameters.periodos.split(',');
    const requisicaoCursos = await axiosDAS.get<Curso[]> (
            `/${ENDPOINTS.CURSOS}`,
            {params:{
                curso: parameters.codigoDeCurso
            }}
        )
    const curso = requisicaoCursos.data[0];

    for(let periodoAtual of listaPeriodos) {
        let payload: CreatePlaquePayload = {
            courseCode:  parameters.codigoDeCurso,
            semester: periodoAtual,
            className: "[SEM NOME]",
            campus: curso.campus,
            approved: false,
            toApprove: false
        } 
        await axiosBackend.post(
            `/${ENDPOINTS.PLACAS_CRIAR}`,
            payload
        )
    }
    
    return "Operação concluída"
}