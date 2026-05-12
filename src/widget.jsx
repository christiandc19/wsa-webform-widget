import React from "react";
import ReactDOM from "react-dom/client";
import FormWidget from "./components/FormWidget";

/*
  WebSmartAssistantForm
  ---------------------
  This is the public white-label webform widget initializer.

  IMPORTANT:
  We only allow public configuration here:
  - target
  - clientKey
  - formKey
  - source

  We do NOT accept apiKey here anymore.
  API keys should never be placed inside WordPress or public widget scripts.
*/
window.WebSmartAssistantForm = function (config = {}) {
  const {
    // The HTML element where the form should appear
    target = "#wsa-form",

    // White-label client identifier
    clientKey = "evergreen-heights",

    // Specific form identifier for this client
    formKey = "senior-living-contact",

    // Tells the dashboard this lead came from the webform widget
    source = "webform",
  } = config;

  const container = document.querySelector(target);

  if (!container) {
    console.error(`WebSmartAssistantForm: target not found: ${target}`);
    return;
  }

  ReactDOM.createRoot(container).render(
    <FormWidget
      clientKey={clientKey}
      formKey={formKey}
      source={source}
    />
  );
};