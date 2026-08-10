import { Stepper } from "./stepper";

const STEPS = [
  { key: "one", caption: "First: the request arrives." },
  { key: "two", caption: "Second: it gets processed." },
  { key: "three", caption: "Third: the response goes out." },
];

export default function StepperDemo() {
  return (
    <Stepper
      steps={STEPS}
      ariaLabel="Request lifecycle stepper"
      render={(i) => (
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: 120,
            background: "var(--moco-panel)",
            borderRadius: 2,
            fontFamily: "var(--moco-mono)",
            color: "var(--moco-ink)",
          }}
        >
          step {i + 1}
        </div>
      )}
    />
  );
}
