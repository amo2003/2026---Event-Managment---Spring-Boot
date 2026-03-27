import axiosInstance from "./axiosConfig";

export const createResolutionReport = async (incidentId, payload) => {
  const response = await axiosInstance.post(
    `/resolution-reports/incident/${incidentId}`,
    payload
  );
  return response.data;
};

export const getResolutionReportByIncidentId = async (incidentId) => {
  const response = await axiosInstance.get(
    `/resolution-reports/incident/${incidentId}`
  );
  return response.data;
};