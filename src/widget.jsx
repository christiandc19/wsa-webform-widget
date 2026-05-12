import React from "react";
import ReactDOM from "react-dom/client";
import FormWidget from "./components/FormWidget";

window.WebSmartAssistantForm = function (config = {}) {
  const {
    target = "#wsa-form",
    clientKey = "evergreen-heights",
    formKey = "senior-living-contact",
    apiUrl = "http://localhost:5297/api/Leads",
    apiKey = "",
    source = "webform",
    recaptchaSiteKey = "",
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
      apiUrl={apiUrl}
      apiKey={apiKey}
      source={source}
      recaptchaSiteKey={recaptchaSiteKey}
    />
  );
};