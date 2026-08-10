import { Cover } from "./cover";

export default function CoverDemo() {
  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "40rem" }}>
      <Cover seed="prompt-caching" alt="Generative curves cover" variant={0} />
      <Cover seed="prefix-blocks" alt="Generative blocks cover" variant={1} />
      <Cover seed="cost-bars" alt="Generative bars cover" variant={2} />
      <Cover seed="any-post-slug" alt="Variant chosen by the seed itself" />
    </div>
  );
}
