import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { EstudanteResponse, PlacaResponse } from "@/interfaces/ServiceResponses";
import { UpdateStudentPayload } from "@/interfaces/ServicePayloads";

export const getEstudatesByPlacaId = async(id: string) => {
    const { data } = await axiosBackend.get<EstudanteResponse[]> (
        `/${ENDPOINTS.ESTUDANTES_PLACA}`,
        {
            params: {
                id: id
            }
        }
    )
    return data;
}

export const updateEstudante = async(payload: UpdateStudentPayload) => {
    const { data } = await axiosBackend.put<EstudanteResponse[]> (
        `/${ENDPOINTS.ATUALIZAR_ESTUDANTE}`,
        payload,
        {
            params: {
                id: payload.id
            }
        }
    )
    return data;
}