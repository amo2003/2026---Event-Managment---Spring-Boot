import axiosInstance from "./axiosConfig";

export const createIncident = async (incidentData) => {
  const formData = new FormData();

  formData.append("incidentType", incidentData.incidentType);

  if (incidentData.priority) {
    formData.append("priority", incidentData.priority);
  }

  formData.append("description", incidentData.description);
  formData.append("reportedBy", incidentData.reportedBy);
  formData.append("placeAreaId", incidentData.placeAreaId);
  formData.append("exactLocation", incidentData.exactLocation);

  if (incidentData.file) {
    formData.append("file", incidentData.file);
  }

  const response = await axiosInstance.post("/incidents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const trackIncident = async (payload) => {
  const response = await axiosInstance.post("/incidents/track", payload);
  return response.data;
};

export const getAllIncidents = async () => {
  const response = await axiosInstance.get("/incidents");
  return response.data;
};

export const getIncidentById = async (incidentId) => {
  const response = await axiosInstance.get(`/incidents/${incidentId}`);
  return response.data;
};

export const filterIncidents = async (filterData) => {
  const response = await axiosInstance.post("/incidents/filter", filterData);
  return response.data;
};

export const getIncidentsByPlace = async () => {
  const response = await axiosInstance.get("/incidents/dashboard/by-place");
  return response.data;
};

export const assignOfficer = async (incidentId, officerId) => {
  const response = await axiosInstance.put(`/incidents/${incidentId}/assign`, {
    officerId,
  });
  return response.data;
};

export const autoAssignOfficer = async (incidentId) => {
  const response = await axiosInstance.put(`/incidents/${incidentId}/auto-assign`);
  return response.data;
};

export const updateIncidentStatus = async (incidentId, payload) => {
  const response = await axiosInstance.put(`/incidents/${incidentId}/status`, payload);
  return response.data;
};

export const getIncidentLogs = async (incidentId) => {
  const response = await axiosInstance.get(`/incidents/${incidentId}/logs`);
  return response.data;
};

export const getIncidentEvidence = async (incidentId) => {
  const response = await axiosInstance.get(`/incidents/${incidentId}/evidence`);
  return response.data;
};

export const uploadIncidentEvidence = async (incidentId, file, uploadedBy) => {
  const formData = new FormData();
  formData.append("file", file);

  if (uploadedBy && uploadedBy.trim()) {
    formData.append("uploadedBy", uploadedBy.trim());
  }

  const response = await axiosInstance.post(
    `/incidents/${incidentId}/evidence`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const checkIncidentEscalation = async (incidentId) => {
  const response = await axiosInstance.post(`/incidents/${incidentId}/check-escalation`);
  return response.data;
};