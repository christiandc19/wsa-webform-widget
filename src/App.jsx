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
      <FormWidget
        clientKey="evergreen-heights"
        formKey="senior-living-contact"
      />
    </div>
  );
}