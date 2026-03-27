import axiosInstance from "./axiosConfig";

export const createOfficer = async (officerData) => {
  const response = await axiosInstance.post("/officers", officerData);
  return response.data;
};

export const getAllOfficers = async () => {
  const response = await axiosInstance.get("/officers");
  return response.data;
};

export const getAvailableOfficers = async () => {
  const response = await axiosInstance.get("/officers/available");
  return response.data;
};