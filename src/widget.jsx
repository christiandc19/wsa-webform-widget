import React from "react";
import ReactDOM from "react-dom/client";
import FormWidget from "./components/FormWidget";

/*
  Public WebSmartAssistant WebForm initializer.

  WordPress/live embed only needs:
  - target
  - clientKey
  - formKey

  The widget will load branding/security settings
  from the webform client registry.
*/
window.WebSmartAssistantForm = function (config = {}) {
  const {
    target = "#wsa-form",
    clientKey = "evergreen-heights",
    formKey = "senior-living-contact",
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