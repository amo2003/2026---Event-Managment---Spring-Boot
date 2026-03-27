import axiosInstance from "./axiosConfig";

export const getAnalyticsSummary = async () => {
  const response = await axiosInstance.get("/analytics/summary");
  return response.data;
};