import axios from "axios";

const API_URL = "http://localhost:8080/api/artist-leads";

const getAllLeads = () => axios.get(API_URL);
const getLeadById = (id) => axios.get(`${API_URL}/${id}`);
const createLead = (leadData) => axios.post(API_URL, leadData);

export default {
  getAllLeads,
  getLeadById,
  createLead,
};