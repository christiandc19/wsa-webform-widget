import evergreenHeightsWebform from "./clients/evergreenHeights";

/*
  WebForm Client Registry
  -----------------------
  This maps each clientKey to its webform configuration.

  To add another client later:
  1. Create a new file in src/webforms/clients/
  2. Import it here
  3. Add it to the webformClients object
*/
const webformClients = {
  "evergreen-heights": evergreenHeightsWebform,
};

/*
  Looks up the client config by clientKey.

  If the clientKey is missing or invalid,
  we safely fall back to Evergreen Heights for now.
*/
export function getWebformClient(clientKey) {
  return webformClients[clientKey] || webformClients["evergreen-heights"];
}