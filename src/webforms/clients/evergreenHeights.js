/*
  Evergreen Heights WebForm Client Config
  --------------------------------------
  This file controls the white-label settings for Evergreen Heights.

  Later, you can add more clients by creating new files inside:
  src/webforms/clients/
*/

const evergreenHeightsWebform = {
  clientKey: "evergreen-heights",

  branding: {
    title: "Contact Us",
    subtitle:
      "Tell us what you need, and our team will follow up with the right next step.",

    // For now we keep the WSA text icon.
    // Later, replace this with a real logo URL if you want.
    logoText: "WSA",
  },

  theme: {
    primaryColor: "#273f80",
    primaryHoverColor: "#1f3266",
  },

  security: {
    // Public Google reCAPTCHA site key.
    // Safe to expose. The secret key stays on the backend.
    recaptchaSiteKey: "6Lf4UdssAAAAAOChTYz1U_qvNYLK9a2fkTVJ55lI",
  },

  forms: {
    "senior-living-contact": {
      formKey: "senior-living-contact",
      title: "Contact Us",
      submitLabel: "Submit",
      successMessage: "Thank you! We’ll be in touch.",
    },
  },
};

export default evergreenHeightsWebform;