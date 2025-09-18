import api from "@/lib/api";
import { AxiosError } from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: "admin" | "user";
  password?: string;
}

// Add this interface for the dynamic request data
interface UpdateUserRequestData {
  name: string;
  email: string;
  role: "admin" | "user";
  password?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UserError {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
  };
}

// Custom error class for validation errors
export class ValidationError extends Error {
  public validationErrors: Record<string, string[]>;

  constructor(message: string, validationErrors: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
    this.validationErrors = validationErrors;
  }
}

// Helper function to process user data
const processUserData = (user: User): User => {
  return {
    ...user,
    role: user.role as "admin" | "user",
  };
};

// Users API service
export const usersService = {
  // GET /users - Returns { success: true, users: User[] }
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<UsersResponse>("/users");
      const processedUsers = response.data.users.map(processUserData);
      return processedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error("You do not have permission to view users");
        }
        throw new Error(
          error.response?.data?.message || "Failed to fetch users"
        );
      }

      throw new Error("Failed to fetch users");
    }
  },

  // GET /users/{id} - Returns User directly
  getById: async (id: number): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return processUserData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error("User not found");
        }
        if (error.response?.status === 403) {
          throw new Error("You do not have permission to view this user");
        }
        throw new Error(
          error.response?.data?.message || `Failed to fetch user with ID ${id}`
        );
      }

      throw new Error(`Failed to fetch user with ID ${id}`);
    }
  },

  // POST /users - Returns { success: true, message: string, user: User }
  create: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<CreateUserResponse>("/users", {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: userData.role,
      });

      return processUserData(response.data.user);
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          throw new ValidationError(
            "Validation failed",
            error.response.data.errors || {}
          );
        }
        if (error.response?.status === 403) {
          throw new Error("You do not have permission to create users");
        }
        throw new Error(
          error.response?.data?.message || "Failed to create user"
        );
      }

      throw new Error("Failed to create user");
    }
  },

  update: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    try {
      // Use proper typing instead of Record<string, any>
      const requestData: UpdateUserRequestData = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        role: userData.role,
      };

      // Only include password if it's provided
      if (userData.password && userData.password.trim()) {
        requestData.password = userData.password.trim();
      }

      const response = await api.put<UpdateUserResponse>(
        `/users/${id}`,
        requestData
      );

      return processUserData(response.data.user);
    } catch (error) {
      console.error("Error updating user:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          // Log the actual validation errors for debugging
          console.log("Validation errors:", error.response.data.errors);
          throw new ValidationError(
            "Validation failed",
            error.response.data.errors || {}
          );
        }
        if (error.response?.status === 403) {
          throw new Error("You do not have permission to update users");
        }
        if (error.response?.status === 404) {
          throw new Error("User not found");
        }
        throw new Error(
          error.response?.data?.message || `Failed to update user with ID ${id}`
        );
      }

      throw new Error(`Failed to update user with ID ${id}`);
    }
  },

  // DELETE /users/{id} - Returns { success: true, message: string }
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete<DeleteUserResponse>(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error("You do not have permission to delete users");
        }
        if (error.response?.status === 404) {
          throw new Error("User not found");
        }
        if (error.response?.status === 409) {
          throw new Error(
            "Cannot delete this user. Check if this is your own account or the last admin."
          );
        }
        throw new Error(
          error.response?.data?.message || `Failed to delete user with ID ${id}`
        );
      }

      throw new Error(`Failed to delete user with ID ${id}`);
    }
  },

  getByRole: async (role: "admin" | "user"): Promise<User[]> => {
    try {
      const allUsers = await usersService.getAll();
      return allUsers.filter((user) => user.role === role);
    } catch (error) {
      console.error("Error filtering users by role:", error);
      throw error; // Re-throw the error from getAll()
    }
  },

  // Search users by name or email (client-side search)
  search: async (searchTerm: string): Promise<User[]> => {
    try {
      const allUsers = await usersService.getAll();
      const term = searchTerm.toLowerCase();
      return allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error("Error searching users:", error);
      throw error; // Re-throw the error from getAll()
    }
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isStrongPassword: (password: string): boolean => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<{ user: User }>("/user");
      return processUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching current user:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return null; // User not authenticated
        }
      }

      throw error;
    }
  },
};

export default usersService;