import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

export const userService = {
    updateProfile: async (data) => {
        // Try to update current user
        // Often it's PUT /users for current user, OR PUT /users/{id}
        // Since we have the ID in the data usually, let's try strict update by ID if available, 
        // otherwise fallback to general update endpoint.
        // But usually /users endpoint is for creating (POST) or listing (GET).
        // Let's assume updating own profile is done via PUT /users

        return axiosClient.put(ENDPOINTS.USERS.BASE, data);
    },

    changePassword: async (data) => {
        return axiosClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    }
};
