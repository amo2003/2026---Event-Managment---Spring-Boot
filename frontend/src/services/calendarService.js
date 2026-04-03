import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/calendar";

// Add event to calendar
const addEventToCalendar = (payload) => {
  return axios.post(API_BASE_URL, payload);
};

// Get calendar by artist
const getCalendarByArtist = (artistId) => {
  return axios.get(`${API_BASE_URL}/artist/${artistId}`);
};

// Get all published events
const getAllPublishedEvents = () => {
  return axios.get(`${API_BASE_URL}/published`);
};

const calendarService = {
  addEventToCalendar,
  getCalendarByArtist,
  getAllPublishedEvents
};

export default calendarService;