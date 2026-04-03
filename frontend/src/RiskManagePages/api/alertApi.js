import api from "./axiosConfig";

export const getAlerts = async () => {
  const response = await api.get("/alerts");
  return response.data;
};