import { ENDPOINTS } from "../util/constants";
import { LoginPayload} from "../interfaces/ServicePayloads"
import { axiosBackend } from "./axios";

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