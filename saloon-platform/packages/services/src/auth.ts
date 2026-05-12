import { apiClient } from "@saloon/network";

// We use any here temporarily if TS isn't fully configured for LoginFormData yet, 
// but in a strict setup we would import the type from @saloon/types
export const loginUser = async (data: any) => {
  const response = await apiClient.post('/api/users/signin', data);
  return response.data;
};
