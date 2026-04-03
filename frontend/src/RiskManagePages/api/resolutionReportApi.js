import api from "./axiosConfig";

export const createResolutionReport = async (incidentId, payload) => {
  const response = await api.post(`/resolution-reports/incident/${incidentId}`, payload);
  return response.data;
};

export const getResolutionReportByIncidentId = async (incidentId) => {
  const response = await api.get(`/resolution-reports/incident/${incidentId}`);
  return response.data;
};