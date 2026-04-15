import axios from "axios";

const API_URL = "http://localhost:8080/api/artist-portal";

const artistPortalService = {
  register(payload) {
    return axios.post(`${API_URL}/register`, payload);
  },

  login(payload) {
    return axios.post(`${API_URL}/login`, payload);
  },

  getDashboard(artistId) {
    return axios.get(`${API_URL}/dashboard/${artistId}`);
  },

  submitFeedback(payload) {
    return axios.post(`${API_URL}/feedback`, payload);
  },

  resetPassword(payload) {
    return axios.put(`${API_URL}/reset-password`, payload);
  },
};

export default artistPortalService;