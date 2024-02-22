import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "241adcea0bb74670b0d220fc308d95ff",
  },
});
