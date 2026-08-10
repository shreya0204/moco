"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import "./view-transitions.css";

/**
 * View Transitions for client-side route changes (Next.js App Router only).
 * Feature-detected, and a complete no-op where unsupported or under
 * prefers-reduced-motion.
 *
 * ponytail: the transition is closed on a short timer rather than on the
 * router's commit, because App Router does not expose a navigation-complete
 * promise. Swap the timer for that promise if/when Next exposes one.
 */
export function ViewTransitions() {
  const router = useRouter();

  React.useEffect(() => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void | Promise<void>) => unknown;
    };
    if (typeof doc.startViewTransition !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;

      e.preventDefault();
      doc.startViewTransition!(async () => {
        router.push(url.pathname + url.search + url.hash);
        await new Promise((r) => setTimeout(r, 90));
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}

/** Removes the `no-js` class so JS-only affordances can hide their fallbacks. */
export function JsFlag() {
  React.useEffect(() => {
    document.documentElement.classList.remove("no-js");
  }, []);
  return null;
}
