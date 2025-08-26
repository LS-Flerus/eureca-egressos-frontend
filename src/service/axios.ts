import { SESSION_STORAGE } from "@/util/constants";
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
  let token = sessionStorage.getItem(SESSION_STORAGE.EGRESSOS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosBackend.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      //window.location.href = "/egressos/";
    }
    return Promise.reject(error);
  }
);

const image_manager_url = "http://localhost:8081/"

export const axiosImageManager = axios.create({
  baseURL: image_manager_url,
  headers: {
    "Content-Type": "application/json"
  }
})

axiosImageManager.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      window.location.href = "/egressos/";
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
      window.location.href = "/egressos/";
    }
    return Promise.reject(error);
  }
);

const eureca_as = `https://eureca.lsd.ufcg.edu.br/as/`

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
      //window.location.href = "/egressos/";
    }
    return Promise.reject(error);
  }
);