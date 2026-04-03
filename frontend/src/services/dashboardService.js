import axios from "axios";

const BASE_URL = "http://localhost:8080/api/artist-dashboard";

const dashboardService = {
  getSummaryByEvent: (eventId) => axios.get(`${BASE_URL}/${eventId}`)
};

export default dashboardService;