import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { SessoesPlacaResponse } from "@/interfaces/ServiceResponses";

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