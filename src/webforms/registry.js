import evergreenHeightsWebform from "./clients/evergreenHeights";
import robinRunWebform from "./clients/robinRun";
import asburyHeightsWebform from "./clients/asburyHeights";

const webformClients = {
  "evergreen-heights": evergreenHeightsWebform,
  "robin-run": robinRunWebform,
  "asbury-heights": asburyHeightsWebform,
};

export function getWebformClient(clientKey) {
  return (
    webformClients[clientKey] ||
    webformClients["evergreen-heights"]
  );
}