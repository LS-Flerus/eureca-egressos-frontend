import { GetTokenPayload } from "@/interfaces/ServicePayloads";
import { axiosAS } from "./axios";
import { GetEurecaProfileResponse, GetTokenResponse } from "@/interfaces/ServiceResponses";
import { SESSION_STORAGE } from "@/util/constants";

export const getToken = async (credenciais: GetTokenPayload) => {
    const {username, password} = credenciais;
    const body = {
      credentials: {
        username,
        password,
      },
    };
    const { data } = await axiosAS.post<GetTokenResponse>(
      `/tokens`,
      body
    );

    return data.token;
};

export const getProfile = async (token: string) => {
  const { data } = await axiosAS.get<GetEurecaProfileResponse>(
    '/profile',
    {
      headers: {
        'accept': 'application/json',
        'token-de-autenticacao': token
      }
    }
  );
  return data;
};