import api from "./axiosConfig";

export const getAnalyticsSummary = async () => {
  const response = await api.get("/analytics/summary");
  return response.data;
};

export const getPlaceCounts = async () => {
  const response = await api.get("/analytics/place-counts");
  return response.data;
};