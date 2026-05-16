// services/smsService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const smsService = {
  // Send single SMS
  sendSingleSMS: async (phoneNumber, message, senderId = null) => {
    try {
      const response = await apiClient.post('/sms/send-sms/', {
        phone_number: phoneNumber,
        message: message,
        sender_id: senderId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to send SMS' };
    }
  },

  // Send bulk SMS
  sendBulkSMS: async (phoneNumbers, message, senderId = null, campaignTitle = 'Bulk SMS Campaign') => {
    try {
      const response = await apiClient.post('/sms/send-bulk-sms/', {
        phone_numbers: phoneNumbers,
        message: message,
        sender_id: senderId,
        campaign_title: campaignTitle,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to send bulk SMS' };
    }
  },

  // Get campaigns
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/sms/campaigns/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch campaigns' };
    }
  },

  // Get balance
  getBalance: async () => {
    try {
      const response = await apiClient.get('/sms/balance/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch balance' };
    }
  },
};