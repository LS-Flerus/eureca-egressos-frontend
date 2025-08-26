import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { GetPhotoResponse } from "@/interfaces/ServiceResponses";
import { CreatePhotoPayload, CreatePlaqueSessionPayload, UpdatePhotoPayload } from "@/interfaces/ServicePayloads";

export const getFotosByPlacaId = async(id: string) => {
    const { data } = await axiosBackend.get<GetPhotoResponse[]> (
        `/${ENDPOINTS.GET_FOTO_PLACA}`,
        {
            params: {
                plaqueId: id
            }
        }
    )
    return data;
}

export const createFoto = async(payload: CreatePhotoPayload) => {
    const { data } = await axiosBackend.post<GetPhotoResponse> (
        `/${ENDPOINTS.CREATE_FOTO}`,
        payload
    )
    return data;
}

export const deleteFoto = async(id: string) => {
    const { data } = await axiosBackend.delete<string> (
        `/${ENDPOINTS.DELETE_FOTO}`,
        {
            params: {
                id: id
            }
        }
    )
}

export const updateFoto = async(payload: UpdatePhotoPayload) => {
    const { data } = await axiosBackend.put<GetPhotoResponse> (
        `/${ENDPOINTS.UPDATE_FOTO}`,
        payload,
        {
            params:{
                id:payload.id
            }
        }
    )
    return data
}