import { BASE_URL } from "../api/config";
import axios from "axios";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      flag: number;
      [key: string]: any;
    };
    token: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      flag: number;
      [key: string]: any;
    };
    token: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: any;
}

export const authService = {
  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Token refresh failed");
    }

    return data;
  },

  /**
   * Logout user
   */
  async logout(accessToken: string, refreshToken: string): Promise<LogoutResponse> {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Logout failed");
    }

    return data;
  },

  /**
   * Get logged-in user profile
   */
  async getProfile(accessToken: string): Promise<ProfileResponse> {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Profile fetch failed");
    }

    return data;
  },


  getNotifications: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async markNotificationRead(id: string, token: string) {
    const response = await axios.put(
      `${BASE_URL}/notifications/read/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

};
