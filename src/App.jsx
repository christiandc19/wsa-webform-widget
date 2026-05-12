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
        Local React testing only.

        In real WordPress embeds, this value comes from:
        window.WebSmartAssistantForm({ recaptchaSiteKey: "..." })
      */}
      <FormWidget
        clientKey="evergreen-heights"
        formKey="senior-living-contact"
        recaptchaSiteKey="6Lf4UdssAAAAAOChTYz1U_qvNYLK9a2fkTVJ55lI"
      />
    </div>
  );
}