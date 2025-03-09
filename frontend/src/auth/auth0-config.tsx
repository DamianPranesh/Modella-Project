import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { FC, PropsWithChildren } from 'react';

type Auth0ProviderWithConfigProps = PropsWithChildren<{}>;

export const Auth0ProviderWithConfig: FC<Auth0ProviderWithConfigProps> = ({ children }) => {
  // Validate environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    throw new Error('Missing Auth0 configuration');
  }

  const config: Auth0ProviderOptions = {
    domain,
    clientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience,
      scope: 'openid profile email'
    },
    cacheLocation: 'localstorage' as const
  };

  return (
    <Auth0Provider {...config}>
      {children}
    </Auth0Provider>
  );
};