const API_BASE_URL = "https://modella-project.up.railway.app/api/v1"; // Change this for production

export const fetchData = async (endpoint: string, options: RequestInit = {}) => {
    const secureBaseUrl = API_BASE_URL.replace('http:', 'https:');
    try {
        // Check if the request body is FormData
        const isFormData = options.body instanceof FormData;

        const response = await fetch(`${secureBaseUrl}/${endpoint}`, {
            ...options,
            headers: isFormData
                ? { ...(options.headers || {}) } // Don't set Content-Type for FormData!
                : {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`404 Not Found: The resource at ${endpoint} could not be found.`);
            } else if (response.status === 500) {
                throw new Error(`500 Internal Server Error: There was an issue with the server.`);
            } else {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        }

        return await response.json();
    } catch (error: unknown) {
        // Replace 'any' with 'unknown' as a safer alternative
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("API Fetch Error:", errorMessage);
        throw error;
    }
};