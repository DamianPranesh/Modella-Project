import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const TokenExchange = () => {
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{ access_token: string, id_token: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Get the 'code' from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Step 2: Check if the 'code' exists, then send it to the backend to exchange for tokens
    if (code) {
        console.log("Code:", code);
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
                  navigate('/explore');
                } else {
                  // Redirect to role selection if no role found
                  navigate('/select-role');
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
      setError('Authorization code not found in URL');
    }

    // Add what to do if code is not there
  }, [navigate]);

  return (
    <div>
      <h1>Token Exchange</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tokens ? (
        <div>
          <h3>Access Token:</h3>
          <pre>{tokens.access_token}</pre>
          <h3>ID Token:</h3>
          <pre>{tokens.id_token}</pre>
        </div>
      ) : (
        <p>Exchanging code for tokens...</p>
      )}
    </div>
  );
};

export default TokenExchange;
