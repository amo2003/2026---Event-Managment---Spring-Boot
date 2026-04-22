import axios from "axios";

const API_URL = "http://localhost:8080/api/artist-votes";

const submitVote = (payload) => {
  return axios.post(API_URL, payload);
};

const getVoteResults = (eventId) => {
  return axios.get(`${API_URL}/${eventId}`);
};

const voteService = {
  submitVote,
  getVoteResults,
};

export default voteService;