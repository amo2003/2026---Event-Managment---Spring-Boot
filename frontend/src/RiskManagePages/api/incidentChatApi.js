import api from "./axiosConfig";

export const getPublicChatMessages = async (trackingCode) => {
  const response = await api.get(`/chat/public/${encodeURIComponent(trackingCode)}`);
  return response.data;
};

export const sendPublicChatMessage = async (trackingCode, payload) => {
  const response = await api.post(
    `/chat/public/${encodeURIComponent(trackingCode)}`,
    payload
  );
  return response.data;
};

export const getOfficerChatMessages = async (incidentId) => {
  const response = await api.get(`/chat/officer/incidents/${incidentId}`);
  return response.data;
};

export const sendOfficerChatMessage = async (incidentId, payload) => {
  const response = await api.post(`/chat/officer/incidents/${incidentId}`, payload);
  return response.data;
};