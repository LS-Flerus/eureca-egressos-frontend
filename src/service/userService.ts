import { ENDPOINTS } from "../util/constants";
import { CreateUserPayload, LoginPayload} from "../interfaces/ServicePayloads"
import { axiosBackend } from "./axios";
import { GetUsuariosResponse } from "@/interfaces/ServiceResponses";

export const authenticateUser = async (credentials: LoginPayload) => {
    const encodedCredentials: string = btoa(unescape(encodeURIComponent(`${credentials.login}:${credentials.senha}`)));
    const authorization = `Basic ${encodedCredentials}`
    console.log(authorization)
    const { data } = await axiosBackend.post<string>(
        `/${ENDPOINTS.LOGIN}`,
        {},
        { headers: { Authorization: authorization }, withCredentials:true }
    )
    sessionStorage.setItem("egressosToken", data)
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