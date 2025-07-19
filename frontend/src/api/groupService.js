import axios from "axios";

const API_URL = import.meta.env.MODE === "production"
  ? "https://ultra-3il5.onrender.com/api/groups"
  : "http://localhost:3001/api/groups";

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

const groupService = {
  addMember: async (groupId, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.MODE === "production" ? "https://ultra-3il5.onrender.com" : "http://localhost:3001"}/api/groups/${groupId}/members`,
      { memberId: userId }, // Update field name if required
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default {
  createGroup,
  getUserGroups,
  ...groupService,
};