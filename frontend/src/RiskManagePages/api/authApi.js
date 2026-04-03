import api from "./axiosConfig";

export const registerOfficer = async (payload) => {
  const response = await api.post("/auth/officer/register", payload);
  return response.data;
};

export const loginOfficer = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await api.post("/auth/change-password", payload);
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
};