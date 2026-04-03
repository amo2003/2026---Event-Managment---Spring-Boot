import axios from "axios";

const API_URL = "http://localhost:8080/api/artist-invitations";

const sendInvitation = (payload) => {
  return axios.post(API_URL, payload);
};

const getInvitationsByEvent = (eventId) => {
  return axios.get(`${API_URL}/event/${eventId}`);
};

const getInvitationsByLead = (leadId) => {
  return axios.get(`${API_URL}/lead/${leadId}`);
};

const respondToInvitation = (invitationId, actionData) => {
  return axios.put(`${API_URL}/${invitationId}/respond`, actionData);
};

const finalizeInvitation = (invitationId) => {
  return axios.put(`${API_URL}/${invitationId}/finalize`);
};

const invitationService = {
  sendInvitation,
  getInvitationsByEvent,
  getInvitationsByLead,
  respondToInvitation,
  finalizeInvitation,
};

export default invitationService;