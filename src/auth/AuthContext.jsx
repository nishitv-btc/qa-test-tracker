import { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(
    keycloak.authenticated ?? false,
  );

  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      setAuthenticated(keycloak.authenticated ?? false);

      if (keycloak.authenticated) {
        setUser({
          username: keycloak.tokenParsed?.preferred_username,
          firstName: keycloak.tokenParsed?.given_name,
          lastName: keycloak.tokenParsed?.family_name,
          email: keycloak.tokenParsed?.email,
          roles: keycloak.tokenParsed?.realm_access?.roles || [],
        });
      } else {
        setUser(null);
      }
    };

    // Initial load
    updateUser();

    // Authentication events
    keycloak.onAuthSuccess = updateUser;

    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setUser(null);
    };

    // Refresh token every minute
    const refreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak
          .updateToken(60)
          .then((refreshed) => {
            if (refreshed) {
              console.log("Token refreshed");
              updateUser();
            }
          })
          .catch(() => {
            console.log("Session expired");
            keycloak.logout();
          });
      }
    }, 60000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        authenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
