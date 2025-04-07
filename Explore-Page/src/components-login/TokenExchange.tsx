import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

import { useUser } from "../components-login/UserContext";
import { fetchData } from "../api/api";

const TokenExchange = () => {
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{
    access_token: string;
    id_token: string;
  } | null>(null);
  const navigate = useNavigate();

  const { userId, setUserId } = useUser();

  // Helper function to get cookies
  const getCookie = (name: string): string | null => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));

    return cookieValue ? cookieValue.split("=")[1] : null;
  };
  
  // Helper function to check if user is already authenticated
  const checkExistingAuth = useCallback((): boolean => {
    const accessToken = getCookie("access_token");
    const idToken = getCookie("id_token");

    if (accessToken && idToken) {
      setTokens({
        access_token: accessToken,
        id_token: idToken,
      });
      sessionStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  }, []);

  // Ensure context updates before navigation
  const handleAuthSuccess = async (userData: {role?: string}, userId: string) => {
    // Update the context with new userId
    setUserId(userId);
    
    // Add a small delay to ensure context updates propagate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Navigate using consistent method
    if (userData.role) {
      navigate("/explore");
    } else {
      navigate("/select-role");
    }
  };

  // Function to fetch user role and redirect
  const fetchRoleAndRedirect = useCallback(
    (accessToken: string) => {
      fetch("https://modella-project.up.railway.app/api/user-details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Check if the token is valid
          if (!response.ok) {
            throw new Error("Token validation failed");
          }
          return response.json();
        })
        .then(async (userData) => {
          const { user_id, role, email } = userData;

          // Log user details
          console.log("User ID:", user_id);
          console.log("Role:", role);
          console.log("Email:", email);

          // Store the role in sessionStorage
          sessionStorage.setItem("userRole", role);

          // Send user data to the backend
          try {
            const response = await fetchData(`users`, {
              method: "POST",
              body: JSON.stringify({
                google_Id: user_id,
                role: role === "business" ? "brand" : role,
                email,
              }),
            });

            console.log("User details successfully sent to backend:", response);
            if (response && response.user_Id) {
              // Use the new handler for consistent auth completion
              await handleAuthSuccess(userData, response.user_Id);
            }
          } catch (err) {
            console.error("Error sending user details:", err);
            // Still navigate even if there was an error
            await handleAuthSuccess(userData, user_id);
          }
        })
        .catch((err) => {
          console.error("Error fetching role:", err);
          // If token validation failed, clear cookies and show login again
          if (err.message === "Token validation failed") {
            document.cookie =
              "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setError("Authentication expired. Please login again.");
          } else {
            console.log("Redirecting to login page...");
            window.location.href = "https://modella-project.up.railway.app/login";
          }
        });
    },
    [navigate]
  );

  useEffect(() => {
    // Step 1: Get the 'code' from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Step 2: Check if the 'code' exists, then send it to the backend to exchange for tokens
    if (code) {
      console.log("Code:", code);

      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Send the code to the backend to get the access token and id token
      fetch(`https://modella-project.up.railway.app/token?code=${code}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Backend response:", data); // Debugging
          if (data.access_token && data.id_token) {
            document.cookie = `access_token=${data.access_token}; path=/`;
            document.cookie = `id_token=${data.id_token}; path=/`;

            setTokens({
              access_token: data.access_token,
              id_token: data.id_token,
            });

            const accessToken = data.access_token;

            fetch("https://modella-project.up.railway.app/api/user-details", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then(async (userData) => {
                const { user_id, role, email } = userData;

                // Log user details
                console.log("User ID:", user_id);
                console.log("Role:", role);
                console.log("Email:", email);

                // Store the role in sessionStorage
                sessionStorage.setItem("userRole", role);

                // Send user data to the backend
                try {
                  const response = await fetchData(`users`, {
                    method: "POST",
                    body: JSON.stringify({
                      google_Id: user_id,
                      role: role === "business" ? "brand" : role,
                      email,
                    }),
                  });

                  console.log(
                    "User details successfully sent to backend:",
                    response
                  );
                  if (response && response.user_Id) {
                    // Use the new handler for consistent auth completion
                    await handleAuthSuccess(userData, response.user_Id);
                  }
                } catch (err) {
                  console.error("Error sending user details:", err);
                  // Still navigate even if there was an error
                  await handleAuthSuccess(userData, user_id);
                }
              })
              .catch((err) => {
                console.error("Error fetching role:", err);
                navigate("/explore"); // Fallback to explore page
              });
          } else {
            setError("Failed to get tokens");
          }
        })
        .catch((err) => {
          setError("Error occurred while fetching tokens");
          console.error(err);
        });
    } else {
      console.log("No code found, checking existing auth...");
      const isAuthenticated = checkExistingAuth();

      if (isAuthenticated) {
        const accessToken = getCookie("access_token")!;
        fetchRoleAndRedirect(accessToken);
      } else {
        // No code and no existing tokens, redirect to login
        console.log("No authentication found, redirecting to login");
        window.location.href = "https://modella-project.up.railway.app/login";
      }
    }
  }, [checkExistingAuth, fetchRoleAndRedirect, navigate]);

  // Log the userId after it has been updated
  useEffect(() => {
    console.log("User ID in context (after state update):", userId);
  }, [userId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD8560] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>

        {/* Display error if it exists */}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

        {/* Display tokens if they exist */}
        {tokens && <div className="text-gray-600 text-center mt-4"></div>}
      </div>
    </div>
  );
};

export default TokenExchange;