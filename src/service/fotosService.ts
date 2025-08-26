import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { GetPhotoResponse } from "@/interfaces/ServiceResponses";
import { CreatePlaqueSessionPayload } from "@/interfaces/ServicePayloads";

export const getFotosByPlacaId = async(id: string) => {
    const { data } = await axiosBackend.get<GetPhotoResponse[]> (
        `/${ENDPOINTS.SESSOES_PLACA}`,
        {
            params: {
                plaqueId: id
            }
        }
    )
    return data;
}

export const createFoto = async(payload: CreatePlaqueSessionPayload) => {
    const { data } = await axiosBackend.post<GetPhotoResponse> (
        `/${ENDPOINTS.CRIAR_SESSAO}`,
        payload
    )
    return data;
}

export const deleteFoto = async(id: string) => {
    const { data } = await axiosBackend.delete<string> (
        `/${ENDPOINTS.DELETAR_SESSAO}`,
        {
            params: {
                id: id
            }
        }
    )
}