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

/* NEW: move finalized artist back to accepted/reviewable state */
const reconsiderInvitation = (invitationId) => {
  return axios.put(`${API_URL}/${invitationId}/reconsider`);
};

/* NEW: remove artist from finalized list */
const removeInvitation = (invitationId) => {
  return axios.put(`${API_URL}/${invitationId}/remove`);
};

/* OPTIONAL generic method if you want flexible status updates later */
const updateInvitationStatus = (invitationId, payload) => {
  return axios.put(`${API_URL}/${invitationId}/status`, payload);
};

const invitationService = {
  sendInvitation,
  getInvitationsByEvent,
  getInvitationsByLead,
  respondToInvitation,
  finalizeInvitation,
  reconsiderInvitation,
  removeInvitation,
  updateInvitationStatus,
};

export default invitationService;