import { apiClient } from "@saloon/network";

export const updateUserProfile = async (data) => {
  const response = await apiClient.put('/api/users/me', data);
  return response.data;
};
