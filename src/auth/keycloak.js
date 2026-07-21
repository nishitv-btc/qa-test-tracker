import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "qa-tracker",
  clientId: "qa-tracker-ui",
});

export default keycloak;