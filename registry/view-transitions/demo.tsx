import { ViewTransitions, JsFlag } from "./view-transitions";

/* Mount once, near the root of a Next.js app layout. Both render null;
   internal <a> link clicks then animate via the View Transitions API. */
export default function ViewTransitionsDemo() {
  return (
    <>
      <ViewTransitions />
      <JsFlag />
      <nav>
        <a href="/">Home</a> <a href="/about">About</a>
      </nav>
    </>
  );
}
