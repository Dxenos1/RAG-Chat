import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-zeta-inky.vercel.app",
});

export default api;
