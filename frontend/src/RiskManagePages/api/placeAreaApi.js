import api from "./axiosConfig";

export const getPlaceAreas = async () => {
  const response = await api.get("/place-areas");
  return response.data;
};