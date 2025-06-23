import axios from "axios";

const API_URL = "http://localhost:3001/api/groups";

const createGroup = (groupData) => {
  const token = localStorage.getItem("token");
  return axios.post(API_URL, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getUserGroups = () => {
  const token = localStorage.getItem("token");
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  createGroup,
  getUserGroups,
};