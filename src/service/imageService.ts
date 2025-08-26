import { ENDPOINTS } from "@/util/constants";
import { axiosImageManager } from "./axios";

export const getImageFromMongoDB = async (id: string) => {
  try {
    const { data } = await axiosImageManager.get(`/${ENDPOINTS.GET_IMAGE_MONGO}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data.image;
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
  }
};

export const uploadImageMongoDB = async (id: string) => {
    try {
    const { data } = await axiosImageManager.post(`/${ENDPOINTS.UPLOAD_IMAGE_MONGO}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data.image;
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
  }
}