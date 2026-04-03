import api from "./axiosConfig";

export const createIncident = async (payload) => {
  const response = await api.post("/incidents", payload);
  return response.data;
};

export const trackIncident = async (trackingCode) => {
  const response = await api.post("/incidents/track", { trackingCode });
  return response.data;
};

export const getAllIncidents = async () => {
  const response = await api.get("/incidents");
  return response.data;
};

export const getIncidentById = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const filterIncidents = async (payload) => {
  const response = await api.post("/incidents/filter", payload);
  return response.data;
};

export const updateIncidentStatus = async (id, payload) => {
  const response = await api.put(`/incidents/${id}/status`, payload);
  return response.data;
};

export const getIncidentTimeline = async (id) => {
  const response = await api.get(`/incidents/${id}/timeline`);
  return response.data;
};

export const uploadEvidence = async (id, file, uploadedBy) => {
  const formData = new FormData();
  formData.append("file", file);

  if (uploadedBy) {
    formData.append("uploadedBy", uploadedBy);
  }

  const response = await api.post(`/incidents/${id}/evidence`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};