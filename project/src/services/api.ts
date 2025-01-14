import {jwtDecode} from 'jwt-decode';
import axios from 'axios';


export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Token {
  token: string;
}

const API_URL = 'http://localhost:3000/api'; // Replace with your API base URL

// Axios instance with default configurations
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the Authorization header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling responses
apiClient.interceptors.response.use(
  (response) => response.data, // Automatically return the response data
  (error) => {
    const { response } = error;
     if (response?.status === 401) {
       console.error('Unauthorized: Redirecting to login...');
      window.location.href = '/login';
     } else if (response?.status === 403) {
       console.error('Forbidden: Insufficient permissions.');
       window.location.href = '/login';
     } else if (response?.data?.message === 'Token expired') {
       console.error('Session expired. Redirecting to login...');
       window.location.href = '/login';
     }
    return Promise.reject(error);
  }
);

// Register a new user
export const registerUser = async (username: string, password: string): Promise<void> => {
  try {
    const response = await apiClient.post('/auth/register', { username, password });
    console.log('User registered:', response);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


export const loginUser = async (username: string, password: string): Promise<string> => {
  try {
    // Define the expected response structure
    interface LoginResponse {
      token: string;
    }

    // Explicitly type the response
    const response = await apiClient.post<string>('/auth/login', { username, password });

    const token  = response.data; // Access the token from response.data
    console.log('User logged in successfully:', response);

    localStorage.setItem('authToken', token); // Save token for later use
    return token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
    }
    console.error('Error logging in:', error);
    throw error;
  }
};



// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime; // Check if token is still valid
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
  console.log('User logged out');
};

// Fetch all locations
export const fetchLocations = async (): Promise<Location[]> => {
  try {
    return await apiClient.get('/locations');
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// Add a new location
export const addLocation = async (location: Location): Promise<Location> => {
  try {
    return await apiClient.post('/locations', location);
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};

// Delete a location by ID
export const deleteLocation = async (locationId: string): Promise<void> => {
  try {
    await apiClient.delete(`/locations/${locationId}`);
    console.log('Location deleted:', locationId);
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};

// Fetch the print queue
export const fetchPrintQueue = async () => {
  try {
    return await apiClient.get('/print-queue');
  } catch (error) {
    console.error('Error fetching print queue:', error);
    throw error;
  }
};

// Handle print request (send file to print)
export const printFile = async (fileId: string) => {
  try {
    return await apiClient.post(`/print-queue/${fileId}/print`);
  } catch (error) {
    console.error('Error printing file:', error);
    throw error;
  }
};

// Fetch analytics data
export const fetchAnalytics = async () => {
  try {
    return await apiClient.get('/analytics');
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};
