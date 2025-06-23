import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configure axios with credentials
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Group API service
const groupService = {
  // Get all groups for the current user
  getUserGroups: async () => {
    try {
      const response = await axiosInstance.get('/groups');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single group by ID
  getGroupById: async (groupId) => {
    try {
      const response = await axiosInstance.get(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new group
  createGroup: async (groupData) => {
    try {
      const response = await axiosInstance.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update group information
  updateGroup: async (groupId, groupData) => {
    try {
      const response = await axiosInstance.put(`/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a member to the group
  addMember: async (groupId, memberId) => {
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/members`, { memberId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove a member from the group
  removeMember: async (groupId, memberId) => {
    try {
      const response = await axiosInstance.delete(`/groups/${groupId}/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Leave a group
  leaveGroup: async (groupId) => {
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Promote a member to admin
  promoteToAdmin: async (groupId, memberId) => {
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/admins`, { memberId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a group
  deleteGroup: async (groupId) => {
    try {
      const response = await axiosInstance.delete(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get messages for a group
  getGroupMessages: async (groupId, page = 1, limit = 50) => {
    try {
      const response = await axiosInstance.get(`/messages/group/${groupId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send a message to a group
  sendGroupMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/messages/group', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark group messages as read
  markGroupMessagesAsRead: async (groupId) => {
    try {
      const response = await axiosInstance.post(`/messages/group/${groupId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default groupService;