import { ENDPOINTS } from "../util/constants";
import { CreateUserPayload, LoginPayload} from "../interfaces/ServicePayloads"
import { axiosBackend } from "./axios";
import { GetUsuariosResponse } from "@/interfaces/ServiceResponses";

export const getUserByEnrollment = async(enrollment: string) => {
    const { data } = await axiosBackend.get<GetUsuariosResponse[]> (
        `/${ENDPOINTS.USUARIO_POR_MATRICULA}`,
        {
            params: {
                enrollment: enrollment
            }
        }
    )
    return data;
}

export const getUsuariosByCurso = async(courseCode: string) => {

    const { data } = await axiosBackend.get<GetUsuariosResponse[]> (
        `/${ENDPOINTS.USUARIOS_POR_CURSO}`,
        { 
            params: {
                courseCode: courseCode
            }
        }
    )
    return data;
}

export const deleteUser = async(userId: string) => {

    const { data } = await axiosBackend.delete<string> (
        `/${ENDPOINTS.DELETAR_USUARIO}`,
        { 
            params: {
                id: userId
            }
        }
    )
    return data;
}

export const createUser = async(payload: CreateUserPayload) => {
    const { data } = await axiosBackend.post<GetUsuariosResponse> (
        `/${ENDPOINTS.CRIAR_USUARIO}`,
        payload
    )
    return data
}