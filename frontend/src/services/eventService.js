import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/events";

const eventService = {
  getAllEvents() {
    return axios.get(API_BASE_URL);
  },

  getEventById(id) {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  createEvent(data) {
    return axios.post(API_BASE_URL, data);
  },

  updateEvent(id, data) {
    return axios.put(`${API_BASE_URL}/${id}`, data);
  },

  deleteEvent(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

export default eventService;