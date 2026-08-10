"use client";

/* scrolly and stepper demos pass render-prop functions to client components,
   so they must render inside a client boundary. Re-exporting them from a
   "use client" module puts them there. */
export { default as ScrollyDemo } from "@moco/registry/scrolly/demo";
export { default as StepperDemo } from "@moco/registry/stepper/demo";
