import { ENDPOINTS } from "@/util/constants";
import { axiosDAS } from "./axios";
import { Curso, Campus } from "@/interfaces/Models";

export const getCampi = async() => {
    const { data } = await axiosDAS.get<Campus[]> (
        `/${ENDPOINTS.CAMPI}`
    )
    return data;
}

export const getCourses = async() => {
    const { data } = await axiosDAS.get<Curso[]> (
        `/${ENDPOINTS.CURSOS}`
    )
    data.sort((a, b) => a.descricao.localeCompare(b.descricao));
    return data;
}