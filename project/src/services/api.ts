import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface UploadFile {
  id: string;
  name: string;
  binaryContents: string;
  userId: string;
  locationId: string;
  queueId: string;
  printPreferences: string;
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

// Login user
export const loginUser = async (username: string, password: string): Promise<string> => {
  try {
    const response = await apiClient.post<string>('/auth/login', { username, password });
    const token = response.data;
    console.log('User logged in successfully:', response);
    localStorage.setItem('authToken', token); // Save token for later use
    return token;
  } catch (error) {
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

// Fetch all locations
export const fetchLocationById = async (locationId: (string | undefined)): Promise<Location> => {
  try {
    return await apiClient.get(`/locations/${locationId}`);
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
export const deleteLocation = async (locationId: string | undefined): Promise<void> => {
  try {
    await apiClient.delete(`/locations/${locationId}`);
    console.log('Location deleted:', locationId);
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};

// Fetch all uploaded files
export const fetchUploadFiles = async (): Promise<UploadFile[]> => {
  try {
    const response = await apiClient.get('/uploads'); // Axios GET request
    console.log('Uploaded files:', response);
    return response; // Return the data property of the response
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    throw error;
  }
};


// Fetch a single uploaded file by ID
export const fetchUploadFileById = async (fileId: string): Promise<UploadFile> => {
  
  try {
    return await apiClient.get(`/uploads/${fileId}`);
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};



// Add a new uploaded file
export const addUploadFile = async (uploadFile: UploadFile): Promise<UploadFile> => {

  // Axios configuration for multipart/form-data
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    return await apiClient.post('/uploads', uploadFile, config );
  } catch (error) {
    console.error('Error adding file upload:', error);
    throw error;
  }
};

// Update an uploaded file by ID
export const updateUploadFile = async (fileId: string, uploadFile: UploadFile): Promise<UploadFile> => {
  try {
    return await apiClient.put(`/uploads/${fileId}`, uploadFile);
  } catch (error) {
    console.error('Error updating file upload:', error);
    throw error;
  }
};

// Delete an uploaded file by ID
export const deleteUploadFile = async (fileId: string): Promise<void> => {
  try {
    await apiClient.delete(`/uploads/${fileId}`);
    console.log('File deleted:', fileId);
  } catch (error) {
    console.error('Error deleting file upload:', error);
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
