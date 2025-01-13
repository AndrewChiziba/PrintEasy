const API_URL = 'http://localhost:3000/api'; // Replace with your API base URL

export interface Location {
  id: string;
  name: string;
  address: string;
}

// Fetch all locations
export const fetchLocations =async (): Promise<Location[]> => {
  try {
    const response = await fetch(`${API_URL}/locations`);
    if (!response.ok) {
      throw new Error('Error fetching locations');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add a new location
export const addLocation = async (location: Location): Promise<Location> => {
  try {
    const response = await fetch(`${API_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error('Error adding location');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete a location by ID
export const deleteLocation = async (locationId: string | undefined): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/locations/${locationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting location');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch the print queue
export const fetchPrintQueue = async () => {
  try {
    const response = await fetch(`${API_URL}/print-queue`);
    if (!response.ok) {
      throw new Error('Error fetching print queue');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Handle print request (send file to print)
export const printFile = async (fileId: string) => {
  try {
    const response = await fetch(`${API_URL}/print-queue/${fileId}/print`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Error printing file');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch analytics data
export const fetchAnalytics = async () => {
  try {
    const response = await fetch(`${API_URL}/analytics`);
    if (!response.ok) {
      throw new Error('Error fetching analytics');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
