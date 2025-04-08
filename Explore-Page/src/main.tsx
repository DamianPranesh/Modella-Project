import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components-login/UserContext.tsx";

// Add fetch interceptor to catch and fix HTTP URLs
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string' && input.includes('http://modella-project.up.railway.app')) {
      console.error('HTTP URL detected:', input);
      console.trace('Call stack for HTTP URL:');
      // Auto-convert to HTTPS to prevent errors (temporary fix)
      input = input.replace('http://', 'https://');
    }
    return originalFetch.call(this, input, init);
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        {/* <App /> */}
        <UserProvider>
          {" "}
          {/* Wrap App inside UserProvider */}
          <App />
        </UserProvider>
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>
);