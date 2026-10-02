import axios from "axios";

const API = axios.create({
  baseURL:
    "https://home-decore-backend-xh6f.onrender.com/api",
  headers: {
    "Content-Type":
      "application/json",
  },
});

export const findBuyers = async (
  data
) => {
  const response = await API.post(
    "/buyers/find",
    data
  );

  return response.data;
};

export const getBuyers = async () => {
  const response = await API.get(
    "/buyers"
  );

  return response.data;
};

export default API;
