import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/admin/events";
const INVITATION_API_URL = "http://localhost:8080/api/artist-invitations";
const LEAD_API_URL = "http://localhost:8080/api/artist-leads";

const calendarService = {
  getAllEvents() {
    return axios.get(API_BASE_URL);
  },

  getInvitationsByEvent(eventId) {
    return axios.get(`${INVITATION_API_URL}/event/${eventId}`);
  },

  getAllLeads() {
    return axios.get(LEAD_API_URL);
  },
};

export default calendarService;