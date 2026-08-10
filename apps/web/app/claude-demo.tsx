"use client";

/* Scripted, self-playing animation: a writer asks Claude Code for a
   component, the MCP tool calls run in a dark macOS terminal, and the
   window flips to a macOS browser showing the real, draggable <Compare>.
   Decorative (no aria-live); the final Compare is real and keyboard-usable. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Compare } from "@moco/registry/compare/compare";

const PROMPT = "claude, add a before/after image slider to my post";

/* Claude Code-style transcript lines, revealed one per step. */
const TOOLS: React.ReactNode[] = [
  <>
    <span className="t-fn">search_components</span>
    <span className="t-mut">(</span>
    <span className="t-str">&quot;before after slider&quot;</span>
    <span className="t-mut">)</span>
    <span className="t-mut">{"  →  "}</span>found: compare
  </>,
  <>
    <span className="t-fn">get_component</span>
    <span className="t-mut">(</span>
    <span className="t-str">&quot;compare&quot;</span>
    <span className="t-mut">)</span>
    <span className="t-mut">{"  →  "}</span>3 files
  </>,
  <>
    <span className="t-fn">Write</span> components/moco/compare.tsx{"  "}
    <span className="t-ok">✓{"  "}(+84 lines)</span>
  </>,
  <>
    <span className="t-fn">Write</span> components/moco/compare.css{"   "}
    <span className="t-ok">✓{"  "}(+52 lines)</span>
  </>,
  <>
    <span className="t-fn">Write</span> components/moco/tokens.css{"    "}
    <span className="t-ok">✓{"  "}(+70 lines)</span>
  </>,
];

/* TOOLS lines + the source preview + the closing "Done." line. */
const TOTAL = TOOLS.length + 2;

/* Skeleton bar for the tiny page mockups inside the Compare. */
function Sk({ w, tone }: { w: number; tone?: "ink" | "lime" }) {
  return <i className={`cdemo-sk${tone ? ` is-${tone}` : ""}`} style={{ width: `${w}%` }} />;
}

/* The landing state is a believable blog post with the component embedded,
   not a bare widget. */
function BrowserPane() {
  return (
    <article className="cdemo-article">
      <h3>The redesign, before and after</h3>
      <p className="cdemo-byline">by shreya · 4 min read</p>
      <p className="cdemo-prose">
        We rebuilt this page around one idea: show, don&rsquo;t tell. Drag the
        seam and compare the two layouts yourself.
      </p>
      <figure className="cdemo-figure">
        <Compare
          height={150}
          beforeLabel="draft"
          afterLabel="final"
          before={
            <div className="cdemo-mock is-draft">
              <Sk w={58} /><Sk w={92} /><Sk w={86} /><Sk w={90} /><Sk w={40} />
            </div>
          }
          after={
            <div className="cdemo-mock is-final">
              <Sk w={46} tone="ink" /><Sk w={24} tone="lime" /><Sk w={92} /><Sk w={88} /><Sk w={64} />
            </div>
          }
        />
        <figcaption>Fig. 1 · The old layout against the new one.</figcaption>
      </figure>
    </article>
  );
}

export function ClaudeDemo() {
  const [started, setStarted] = useState(false);
  const [chars, setChars] = useState(0);
  const [lines, setLines] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  /* Start once when scrolled into view; reduced motion jumps to the end
     (and never loops). */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reduced.current = true;
      setChars(PROMPT.length);
      setLines(TOTAL);
      setFlipped(true);
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* One timeout per state transition: type, stagger lines, flip, hold,
     then start over. Paced for reading, not for speed. The loop pauses
     while the pointer is over the frame so it never restarts mid-drag. */
  useEffect(() => {
    if (!started) return;
    let t: number;
    if (!flipped) {
      if (chars < PROMPT.length) {
        t = window.setTimeout(() => setChars((c) => c + 1), 45);
      } else if (lines < TOTAL) {
        t = window.setTimeout(() => setLines((l) => l + 1), lines === 0 ? 1000 : 850);
      } else {
        t = window.setTimeout(() => setFlipped(true), 2400);
      }
    } else if (!reduced.current && !hovered) {
      t = window.setTimeout(() => {
        setChars(0);
        setLines(0);
        setFlipped(false);
      }, 6000);
    }
    return () => clearTimeout(t);
  }, [started, chars, lines, flipped, hovered]);

  const replay = useCallback(() => {
    setChars(0);
    setLines(0);
    setFlipped(false);
    setStarted(true);
  }, []);

  const typing = started && chars < PROMPT.length;

  return (
    <div className="cdemo" ref={ref}>
      <div
        className={`cdemo-frame${flipped ? " is-flipped" : ""}`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <div className="cdemo-pane cdemo-terminal" aria-hidden={flipped}>
          <div className="cdemo-bar">
            <span className="cdemo-dots" aria-hidden="true">
              <i /><i /><i />
            </span>
            <span className="cdemo-title">shreya@mac — claude</span>
          </div>
          <div className="cdemo-body">
            <p className="cdemo-prompt">
              <span className="cdemo-ps" aria-hidden="true">❯</span>{" "}
              {PROMPT.slice(0, chars)}
              {typing && <span className="cdemo-caret" aria-hidden="true" />}
            </p>
            {TOOLS.map(
              (tool, i) =>
                lines > i && (
                  <p key={i} className="cdemo-line">
                    <span
                      className={`cdemo-bullet${lines > i + 1 ? " is-done" : ""}`}
                      aria-hidden="true"
                    >
                      {lines > i + 1 ? "⏺" : "…"}
                    </span>
                    {tool}
                  </p>
                ),
            )}
            {lines > TOOLS.length && (
              <pre className="cdemo-code" aria-hidden="true">
                <span className="c-kw">export function</span>{" "}
                <span className="c-fn">Compare</span>
                {"({ before, after }: CompareProps) {\n  "}
                <span className="c-kw">const</span>
                {" [pos, setPos] = "}
                <span className="c-fn">useState</span>
                {"(50);\n  "}
                <span className="c-kw">return</span>
                {" <div className="}
                <span className="c-str">&quot;moco-compare&quot;</span>
                {" …"}
              </pre>
            )}
            {lines >= TOTAL && (
              <p className="cdemo-done">Done. Compare is live on your page.</p>
            )}
          </div>
        </div>

        <div
          className="cdemo-pane cdemo-browser"
          aria-hidden={!flipped}
          inert={!flipped}
        >
          <div className="cdemo-bar">
            <span className="cdemo-dots" aria-hidden="true">
              <i /><i /><i />
            </span>
            <span className="cdemo-navbtns" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m14 6-6 6 6 6" />
              </svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m10 6 6 6-6 6" />
              </svg>
            </span>
            <span className="cdemo-url">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3Z" />
              </svg>
              localhost:3000
            </span>
            <span className="cdemo-bar-spacer" aria-hidden="true" />
          </div>
          <div className="cdemo-body cdemo-page">
            <BrowserPane />
          </div>
        </div>

        <button type="button" className="cdemo-replay" onClick={replay}>
          Replay
        </button>
      </div>
      <p className="cdemo-caption">
        This is real. Add the moco MCP server and ask.{" "}
        <Link href="/docs/mcp">Set it up</Link>
      </p>
    </div>
  );
}
