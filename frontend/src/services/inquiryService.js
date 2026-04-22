import axios from "axios";

const API_URL = "http://localhost:8080/api/artist-inquiries";

const sendInquiry = (payload) => {
  return axios.post(API_URL, payload);
};

const getInquiriesByArtist = (artistId) => {
  return axios.get(`${API_URL}/artist/${artistId}`);
};

const getInquiriesByEvent = (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}`);
};

const respondToInquiry = (inquiryId, actionData) => {
  return axios.put(`${API_URL}/${inquiryId}/respond`, actionData);
};

const inquiryService = {
  sendInquiry,
  getInquiriesByArtist,
  getInquiriesByEvent,
  respondToInquiry,
};

export default inquiryService;