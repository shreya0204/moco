import { ScrollyStage, type StepShape } from "./scrolly";

const STEPS: StepShape[] = [
  {
    key: "one",
    caption: "Step one: the figure shows state A.",
    text: <p>Scroll down. The pinned figure on the right tracks whichever step crosses the middle of the viewport.</p>,
  },
  {
    key: "two",
    caption: "Step two: the figure shows state B.",
    text: <p>Each step is just prose plus a key and caption — the figure is whatever the render prop returns.</p>,
  },
  {
    key: "three",
    caption: "Step three: the figure shows state C.",
    text: <p>Below 1024px the figure unpins and each step renders its own inline snapshot instead.</p>,
  },
];

export default function ScrollyDemo() {
  return (
    <ScrollyStage
      steps={STEPS}
      render={(step, i, progress) => (
        <div
          style={{
            display: "grid",
            placeItems: "center",
            height: 160,
            fontFamily: "var(--moco-mono)",
            color: "var(--moco-ink)",
          }}
        >
          {step.key} — {Math.round(progress * 100)}%
        </div>
      )}
    />
  );
}
