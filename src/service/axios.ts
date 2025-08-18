import axios, { AxiosError } from "axios";

const api_url = "http://localhost:8080/" //"https://eureca.lsd.ufcg.edu.br/egressos-backend/"

export const axiosInstance = axios.create({
  baseURL: api_url,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "any",
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use((config) => {
  let token = sessionStorage.getItem("token")
  if (token) {
    config.headers.token = `${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      window.location.href = "/eureca/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;