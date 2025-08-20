import { ENDPOINTS } from "@/util/constants";
import { axiosBackend } from "./axios";
import { Placa } from "@/interfaces/Models";
import { FiltersPayload } from "@/interfaces/ServicePayloads";
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

export const getPlacasById = async(id: string) => {
    const { data } = await axiosBackend.get<PlacaResponse[]> (
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