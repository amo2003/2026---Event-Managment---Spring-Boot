import axiosInstance from "./axiosConfig";

export const loginUserApi = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

export const changePasswordApi = async (payload) => {
  const response = await axiosInstance.post("/auth/change-password", payload);
  return response.data;
};