import { apiClient } from "@saloon/network";

export const getServices = async () => {
  const response = await apiClient.get('/api/booking/services');
  return response.data.data; // Access the 'data' array from the ApiResponse
};

export const getStaff = async () => {
  const response = await apiClient.get('/api/booking/staff');
  return response.data.data; // Access the 'data' array from the ApiResponse
};

export const getAvailability = async (requestData) => {
  const response = await apiClient.post('/api/booking/availability', requestData);
  return response.data.data; // Access the 'data' from the ApiResponse
};

export const createAppointment = async (bookingData) => {
  const response = await apiClient.post('/api/booking/book', bookingData);
  return response.data.data; // Access the 'data' from the ApiResponse
};

export const getMyAppointments = async () => {
  const response = await apiClient.get('/api/booking/my-appointments');
  return response.data.data; // Access the 'data' array from the ApiResponse
};
