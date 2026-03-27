import axiosInstance from "./axiosConfig";

export const getAllAlerts = async () => {
  const response = await axiosInstance.get("/alerts");
  return response.data;
};