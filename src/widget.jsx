import React from "react";
import ReactDOM from "react-dom/client";
import FormWidget from "./components/FormWidget";
import { getWebformClient } from "./webforms/registry";
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


  /*
  Load the white-label client config
  so we can access the reCAPTCHA site key.
  */
  const clientConfig = getWebformClient(clientKey);

  const recaptchaSiteKey =
    clientConfig?.security?.recaptchaSiteKey;

  /*
    Dynamically load Google reCAPTCHA Enterprise.
  */
  if (
    recaptchaSiteKey &&
    !document.querySelector("#wsa-recaptcha-enterprise")
  ) {
    const script = document.createElement("script");

    script.id = "wsa-recaptcha-enterprise";

    script.src =
      `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`;

    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  }

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