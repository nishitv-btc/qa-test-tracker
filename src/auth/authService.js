import keycloak from "./keycloak";

export const login = () => keycloak.login();

export const logout = () => keycloak.logout();

export const getToken = () => keycloak.token;

export const getUser = () => keycloak.tokenParsed;

export const hasRole = (role) => keycloak.hasRealmRole(role);