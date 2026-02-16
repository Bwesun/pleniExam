import api from './api';
import { ApiResponse, User } from '../types';

export const userService = {
  // Get all users
  getAllUsers: async (params?: {
    role?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/users/${id}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (
    id: string,
    role: 'candidate' | 'instructor' | 'admin'
  ): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}/role`, {
      role,
    });
    return response.data;
  },

  // Update user status
  updateUserStatus: async (
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}/status`, {
      isActive,
    });
    return response.data;
  },
};
