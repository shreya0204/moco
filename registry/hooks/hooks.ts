"use client";

import * as React from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Index of the section currently crossing the middle band of the viewport. */
export function useScrollspy(ids: string[]): number {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (!ids.length) return;
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRatio);
        // The last heading whose top has passed the band wins.
        let next = 0;
        ids.forEach((id, i) => {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) next = i;
        });
        setActive(next);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.5, 1] },
    );
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as Element[];
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      let next = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) next = i;
      });
      setActive(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

/** 0→1 read progress through the first element matching the selector. */
export function useReadProgress(selector = "#article-root"): number {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const start = el.offsetTop;
      const end = start + el.offsetHeight - window.innerHeight;
      const y = window.scrollY;
      const raw = end > start ? (y - start) / (end - start) : 0;
      setP(Math.min(1, Math.max(0, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [selector]);
  return p;
}

/** Fires once when the element first enters the viewport. */
export function useInView<T extends Element>(
  ref: React.RefObject<T | null>,
  { once = true, rootMargin = "0px 0px -15% 0px" } = {},
): boolean {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        } else if (!once) {
          setSeen(false);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin]);
  return seen;
}

export function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.setAttribute("tabindex", "-1");
  (el as HTMLElement).focus({ preventScroll: true });
}
