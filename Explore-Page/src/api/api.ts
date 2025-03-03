const API_BASE_URL = "http://localhost:8000/api/v1"; // Change this for production

export const fetchData = async (endpoint: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};
