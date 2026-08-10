"use client";

import * as React from "react";
import { Note, Term } from "./notes";

export default function NotesDemo() {
  return (
    <div className="moco-notes-scope" style={{ maxWidth: 640, margin: "0 auto" }}>
      <p>
        Margin notes number themselves in document order
        <Note>
          This is a margin note. On wide screens it sits in the right gutter;
          on narrow ones it becomes this tap-to-expand disclosure.
        </Note>
        and a{" "}
        <Term def="A short inline definition that appears on hover or keyboard focus, flipping sides near the viewport edge.">
          term
        </Term>{" "}
        reveals its definition without leaving the sentence.
      </p>
      <p>
        A second note
        <Note>Counters need no registration — this one is “2” automatically.</Note>{" "}
        keeps counting on its own.
      </p>
    </div>
  );
}
