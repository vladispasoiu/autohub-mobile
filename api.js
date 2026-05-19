import axios from 'axios';

const API_URL = 'https://web-production-72bd.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const getGarages = async (city = null, search = null) => {
  try {
    const params = {};
    if (city) params.city = city;
    if (search) params.search = search;
    const response = await api.get('/garages/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching garages:', error);
    return [];
  }
};

export const getGarage = async (id) => {
  try {
    const response = await api.get(`/garages/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching garage:', error);
    return null;
  }
};

export const registerGarage = async (garageData) => {
  try {
    const response = await api.post('/garages/', garageData);
    return response.data;
  } catch (error) {
    console.error('Error registering garage:', error);
    return null;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export default api;