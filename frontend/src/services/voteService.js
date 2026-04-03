import axios from "axios";

const voteService = {
  submitVote(payload) {
    return axios.post("http://localhost:8080/api/artist-votes", payload);
  },
  getResults(eventId) {
    return axios.get(`http://localhost:8080/api/artist-votes/${eventId}`);
  },
};

export default voteService;
