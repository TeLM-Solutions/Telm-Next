import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://api.woodq.store",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  },
});

export default axios;

