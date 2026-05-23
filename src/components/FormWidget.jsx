import { useEffect, useMemo, useState } from "react";
import "./FormWidget.css";
import { getWebformClient } from "../webforms/registry";

const timeOptions = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

  export default function FormWidget({
    // White-label client identifier.
    clientKey = "evergreen-heights",

    // White-label form identifier.
    formKey = "senior-living-contact",

    // Lead source shown in your dashboard.
    source = "webform",
  }) {


      /*
    Load white-label client settings from the registry.

    This is what makes the webform work like your chatbot/survey setup:
    clientKey + formKey control the branding, security, and form settings.
  */
  const clientConfig = getWebformClient(clientKey);
  const formConfig = clientConfig.forms?.[formKey] || {};

  const branding = clientConfig.branding || {};
  const theme = clientConfig.theme || {};
  const security = clientConfig.security || {};

  const recaptchaSiteKey = security.recaptchaSiteKey || "";

  // NEW: Load Google reCAPTCHA Enterprise inside the form too.
  // This makes it work in local App.jsx testing and in the live widget.
  useEffect(() => {
    if (!recaptchaSiteKey) return;

    if (document.querySelector("#wsa-recaptcha-enterprise")) return;

    const script = document.createElement("script");
    script.id = "wsa-recaptcha-enterprise";
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  }, [recaptchaSiteKey]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryFor: "",
    connectPreference: "",
    lifestyleInterest: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const needsLifestyle = form.connectPreference === "Download a Brochure";

  const needsAppointment =
    form.connectPreference === "Schedule A Visit" ||
    form.connectPreference === "Speak to an Advisor";

  const needsMessage =
    form.connectPreference === "Schedule A Visit" ||
    form.connectPreference === "Speak to an Advisor" ||
    form.connectPreference === "Career Opportunities" ||
    form.connectPreference === "Vendor/Volunteer/Other";

  const dashboardMessage = useMemo(() => {
    return [
      "Webform Submission",
      "",
      `I am inquiring for: ${form.inquiryFor || "N/A"}`,
      `How would you like to connect?: ${form.connectPreference || "N/A"}`,
      needsLifestyle
        ? `Lifestyle Interest: ${form.lifestyleInterest || "N/A"}`
        : null,
      needsAppointment ? `Preferred Date: ${form.preferredDate || "N/A"}` : null,
      needsAppointment ? `Preferred Time: ${form.preferredTime || "N/A"}` : null,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }, [form, needsLifestyle, needsAppointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      // NEW: Clear conditional fields when the connect preference changes.
      // This prevents old hidden answers from being submitted by accident.
      if (name === "connectPreference") {
        updated.lifestyleInterest = "";
        updated.preferredDate = "";
        updated.preferredTime = "";
        updated.message = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

    // Default empty token
    let recaptchaToken = "";

    // Generate a Google reCAPTCHA Enterprise token before submitting.
    // This matches your Google Cloud key type: Website • Score.
    if (recaptchaSiteKey && window.grecaptcha?.enterprise) {
      recaptchaToken = await new Promise((resolve, reject) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(
              recaptchaSiteKey,
              { action: "webform_submit" }
            );

            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

console.log("Generated reCAPTCHA token:", recaptchaToken);

      console.log("reCAPTCHA token:", recaptchaToken);

            /*
        IMPORTANT:
        The widget now talks to a PUBLIC backend endpoint.

        The frontend no longer knows:
        - API keys
        - secret backend configuration

        The backend will securely handle:
        - API authentication
        - lead validation
        - client validation
      */
        // -----------------------------------------
        // Backend API URL
        // -----------------------------------------
        const API_BASE_URL =
          window.location.hostname === "localhost"
            ? "http://localhost:5297"
            : "https://api.websmartassistant.com";

        // -----------------------------------------
        // Submit webform
        // -----------------------------------------
        const response = await fetch(
          `${API_BASE_URL}/api/public/webform-submit`,
          

        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,

          source,
          formKey,
          recaptchaToken,
          clientKey,
          
          // NEW: Save a readable summary on the Lead record.
          message: dashboardMessage,

          // NEW: Also save the webform summary as a conversation
          // so it appears in the dashboard message panel.
          conversations: [
            {
              message: dashboardMessage,
              sender: "user",
            },
          ],
        }),
      });

        if (!response.ok) {
          /*
            This usually means the backend endpoint does not exist yet
            or the backend rejected the request.
          */
          throw new Error(`Failed to submit. Status: ${response.status}`);
        }

      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        inquiryFor: "",
        connectPreference: "",
        lifestyleInterest: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        "The form could not be submitted yet. The widget loaded correctly, but the backend endpoint still needs to be created."
      );
    } finally {
      /*
        Always stop the loading state after the request finishes,
        even if the backend returns an error.
      */
      setLoading(false);
    }
    };

  if (success) {
    return (
      <div className="wsa-form-success">
        ✅ {formConfig.successMessage || "Thank you! We’ll be in touch."}
      </div>
    );
  }

  return (
      <form
        className="wsa-form-card"
        onSubmit={handleSubmit}
        style={{
          "--wsa-form-primary":
            theme.primaryColor || "#2563eb",
        }}
      >
      <div className="wsa-form-header">
        <div>
          <h2>{formConfig.title || branding.title || "Contact Us"}</h2>
          <p>
            {branding.subtitle ||
              "Tell us what you need, and our team will follow up with the right next step."}
          </p>
        </div>
      </div>

      <div className="wsa-form-grid">
        <div className="wsa-form-field">
          <label>First Name *</label>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="wsa-form-field">
          <label>Last Name *</label>
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="wsa-form-field">
          <label>Email Address *</label>
          <input
            name="email"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="wsa-form-field">
          <label>Phone Number *</label>
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="wsa-form-field">
          <label>I am inquiring for *</label>
          <select
            name="inquiryFor"
            value={form.inquiryFor}
            onChange={handleChange}
            required
          >
            <option value="">Select one</option>
            <option value="Self">Self</option>
            <option value="Parents">Parents</option>
            <option value="Spouse">Spouse</option>
            <option value="Relative">Relative</option>
            <option value="Friend">Friend</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="wsa-form-field">
          <label>How would you like to connect? *</label>
          <select
            name="connectPreference"
            value={form.connectPreference}
            onChange={handleChange}
            required
          >
            <option value="">Select one</option>
            <option value="Download a Brochure">Download a Brochure</option>
            <option value="Schedule A Visit">Schedule A Visit</option>
            <option value="Speak to an Advisor">Speak to an Advisor</option>
            <option value="Career Opportunities">Career Opportunities</option>
            <option value="Vendor/Volunteer/Other">Vendor/Volunteer/Other</option>
          </select>
        </div>

        {needsLifestyle && (
          <div className="wsa-form-field full">
            <label>Which lifestyle are you most interested in? *</label>
            <select
              name="lifestyleInterest"
              value={form.lifestyleInterest}
              onChange={handleChange}
              required
            >
              <option value="">Select lifestyle</option>
              <option value="Independent Living">Independent Living</option>
              <option value="Assisted Living">Assisted Living</option>
              <option value="Memory Care">Memory Care</option>
            </select>
          </div>
        )}

        {needsAppointment && (
          <>
            <div className="wsa-form-field">
              <label>Preferred Date *</label>
              <input
                name="preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="wsa-form-field">
              <label>Preferred Time *</label>
              <select
                name="preferredTime"
                value={form.preferredTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {needsMessage && (
          <div className="wsa-form-field full">
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Add any helpful details..."
              value={form.message}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <button
        className="wsa-form-submit"
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: theme.primaryColor,
        }}
      >
        {loading ? "Submitting..." : formConfig.submitLabel || "Submit"}
      </button>

      <p className="wsa-form-note">
        Your information is secure and will never be shared.
      </p>
    </form>
  );
}