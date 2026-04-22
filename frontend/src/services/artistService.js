import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/artists";

const artistService = {
  getAllArtists() {
    return axios.get(API_BASE_URL);
  },

  getArtistById(id) {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  createArtist(data) {
    return axios.post(API_BASE_URL, data);
  },

  updateArtist(id, data) {
    return axios.put(`${API_BASE_URL}/${id}`, data);
  },

  deleteArtist(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

export default artistService;