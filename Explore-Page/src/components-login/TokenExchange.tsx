import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';


const TokenExchange = () => {
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{ access_token: string, id_token: string } | null>(null);
  const navigate = useNavigate();

  // Helper function to get cookies
  const getCookie = (name: string): string | null => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    
    return cookieValue ? cookieValue.split('=')[1] : null;
  };
  // Edit 1
  // Helper function to check if user is already authenticated
  const checkExistingAuth = useCallback((): boolean => {
    const accessToken = getCookie('access_token');
    const idToken = getCookie('id_token');
    
    if (accessToken && idToken) {
      setTokens({
        access_token: accessToken,
        id_token: idToken
      });
      sessionStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  }, []);

  // Function to fetch user role and redirect
  const fetchRoleAndRedirect = useCallback((accessToken: string) => {
    fetch('http://localhost:8000/api/user-role', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        // Check if the token is valid
        if (!response.ok) {
          throw new Error('Token validation failed');
        }
        return response.json();
      })
      .then(roleData => {
        // Store the role in sessionStorage
        sessionStorage.setItem('userRole', roleData.role);
        
        // Redirect to the appropriate page
        if (roleData.role) {
          navigate('/explore');
        } else {
          navigate('/select-role');
        }
      })
      .catch(err => {
        console.error("Error fetching role:", err);
        // If token validation failed, clear cookies and show login again
        if (err.message === 'Token validation failed') {
          document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          setError('Authentication expired. Please login again.');
        } else {
          console.log('Redirecting to login page...');
          window.location.href = 'http://localhost:8000/login';
        }
      });
  }, [navigate]);
  // Edit 1 End

  useEffect(() => {
    // Step 1: Get the 'code' from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Step 2: Check if the 'code' exists, then send it to the backend to exchange for tokens
    if (code) {
      console.log("Code:", code);

      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          // Send the code to the backend to get the access token and id token
      fetch(`http://localhost:8000/token?code=${code}`, {
        method: 'GET',
        credentials: 'include',
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
            
            fetch('http://localhost:8000/api/user-role', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            })
              .then(response => response.json())
              .then(roleData => {
                // Store the role in sessionStorage
                sessionStorage.setItem('userRole', roleData.role);
                
                // Now redirect to the appropriate page
                if (roleData.role) {
                  window.location.href = '/explore';
                } else {
                  // Redirect to role selection if no role found
                  window.location.href = '/';
                  // window.location.href = '/select-role';
                }
              })
              .catch(err => {
                console.error("Error fetching role:", err);
                navigate('/explore'); // Fallback to explore page
              });
          } else {
            setError('Failed to get tokens');
          }
        })
        .catch((err) => {
          setError('Error occurred while fetching tokens');
          console.error(err);
        });
    } else {
      console.log('No code found, checking existing auth...');
      const isAuthenticated = checkExistingAuth();
      
      if (isAuthenticated) {
        const accessToken = getCookie('access_token')!;
        fetchRoleAndRedirect(accessToken);
      } else {
        // No code and no existing tokens, redirect to login
        console.log('No authentication found, redirecting to login');
        window.location.href = 'http://localhost:8000/login';
      }
    }

    // Add what to do if code is not there
  }, [checkExistingAuth, fetchRoleAndRedirect, navigate]);

  return ( 
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>

        {/* Display error if it exists */}
        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}

        {/* Display tokens if they exist */}
        {tokens && (
          <div className="text-gray-600 text-center mt-4">
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenExchange;