import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { EstudanteResponse, PlacaResponse } from "@/interfaces/ServiceResponses";

export const getEstudatesByPlacaId = async(id: string) => {
    console.log("alô")
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