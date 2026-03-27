import axiosInstance from "./axiosConfig";

export const getAllPlaceAreas = async () => {
  const response = await axiosInstance.get("/place-areas");
  return response.data;
};