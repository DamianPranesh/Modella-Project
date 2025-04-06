import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./components-login/UserContext.tsx";

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
