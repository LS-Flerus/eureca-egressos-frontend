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

export const uploadImageMongoDB = async (img: string) => {
    try {
    const { data } = await axiosImageManager.post(`/${ENDPOINTS.UPLOAD_IMAGE_MONGO}`,
        {img: img},
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
    );
    console.log(data.data)
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
  }
}

export const deleteImageMongoDB = async (id: string) => {
    try {
        const { data } = await axiosImageManager.get(`/${ENDPOINTS.DELETE_IMAGE_MONGO}/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data.image;
  } catch (error) {
        console.error("Erro ao buscar imagem:", error);
  }
}