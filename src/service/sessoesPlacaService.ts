import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { SessoesPlacaResponse } from "@/interfaces/ServiceResponses";
import { CreatePlaqueSessionPayload } from "@/interfaces/ServicePayloads";

export const getSessoesByPlacaId = async(id: string) => {
    const { data } = await axiosBackend.get<SessoesPlacaResponse[]> (
        `/${ENDPOINTS.SESSOES_PLACA}`,
        {
            params: {
                plaqueId: id
            }
        }
    )
    return data;
}

export const createPlaqueSession = async(payload: CreatePlaqueSessionPayload) => {
    const { data } = await axiosBackend.post<SessoesPlacaResponse> (
        `/${ENDPOINTS.CRIAR_SESSAO}`,
        payload
    )
    return data;
}

export const deletePlaqueSession = async(id: string) => {
    const { data } = await axiosBackend.delete<string> (
        `/${ENDPOINTS.DELETAR_SESSAO}`,
        {
            params: {
                id: id
            }
        }
    )
}