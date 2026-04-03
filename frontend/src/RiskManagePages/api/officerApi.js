import api from "./axiosConfig";

export const getOfficers = async () => {
  const response = await api.get("/officers");
  return response.data;
};