import { fetchData } from "./api"; // Import the existing API function

// Function to fetch allowed values for a given category
export const getDropdownOptions = async (category: string): Promise<string[]> => {
  try {
    const response = await fetchData(`keywords/filters/${category}`, { method: "GET" });
    return response; // Assuming response is already an array of strings
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return []; // Return an empty array on failure
  }
};
