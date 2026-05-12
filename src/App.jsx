import FormWidget from "./components/FormWidget";

export default function App() {
  return (
    <div
      style={{
        padding: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/*
        Local React testing.

        The form now loads branding, theme, and reCAPTCHA site key
        from src/webforms/registry.js using clientKey + formKey.
      */}
      <FormWidget
        clientKey="evergreen-heights"
        formKey="senior-living-contact"
      />
    </div>
  );
}