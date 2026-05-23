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
  },

  // Button Color
  theme: {
    primaryColor: "#1b5e3b",
  },

  security: {
    recaptchaSiteKey: "6LcL9fgsAAAAAL9l96dQ_vwVObyLDHXSWQRij3iG",
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