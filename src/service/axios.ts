import axios, { AxiosError } from "axios";

const api_url = "http://localhost:8080/" //"https://eureca.lsd.ufcg.edu.br/egressos-backend/"

export const axiosBackend = axios.create({
  baseURL: api_url,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "any",
    "Content-Type": "application/json",
  }
});

axiosBackend.interceptors.request.use((config) => {
  let token = sessionStorage.getItem("token")
  if (token) {
    config.headers.token = `${token}`;
  }

  return config;
});

axiosBackend.interceptors.response.use(
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

const eureca_DAS = `https://eureca.lsd.ufcg.edu.br/das/v2/`

export const axiosDAS = axios.create({
  baseURL: eureca_DAS,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

axiosDAS.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      window.location.href = "/graduacao/";
    }
    return Promise.reject(error);
  }
);

const eureca_as = `https://eureca.lsd.ufcg.edu.br/as-sig/`

export const axiosAS = axios.create({
  baseURL: eureca_as,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

axiosAS.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      window.location.href = "/graduacao/";
    }
    return Promise.reject(error);
  }
);