/* Static manifest of every registry demo. One entry per registry item that
   ships a demo.tsx; "tokens" has none (the whole site is its demo). */
import type { ComponentType } from "react";

import CodeDemo from "@moco/registry/code/demo";
import CompareDemo from "@moco/registry/compare/demo";
import CountUpDemo from "@moco/registry/countup/demo";
import CoverDemo from "@moco/registry/cover/demo";
import DiagramDemo from "@moco/registry/diagram/demo";
import DotGridDemo from "@moco/registry/dotgrid/demo";
import FigureDemo from "@moco/registry/figure/demo";
import HooksDemo from "@moco/registry/hooks/demo";
import IslandDemo from "@moco/registry/island/demo";
import MathDemo from "@moco/registry/math/demo";
import NotesDemo from "@moco/registry/notes/demo";
import PaletteDemo from "@moco/registry/palette/demo";
import RailDemo from "@moco/registry/rail/demo";
import ScrubDemo from "@moco/registry/scrub/demo";
import SparkDemo from "@moco/registry/spark/demo";
import { ScrollyDemo, StepperDemo } from "./client-demos";
import ViewTransitionsDemo from "@moco/registry/view-transitions/demo";
import ZoomDemo from "@moco/registry/zoom/demo";

export const demos: Record<string, ComponentType> = {
  code: CodeDemo,
  compare: CompareDemo,
  countup: CountUpDemo,
  cover: CoverDemo,
  diagram: DiagramDemo,
  dotgrid: DotGridDemo,
  figure: FigureDemo,
  hooks: HooksDemo,
  island: IslandDemo,
  math: MathDemo,
  notes: NotesDemo,
  palette: PaletteDemo,
  rail: RailDemo,
  scrolly: ScrollyDemo,
  scrub: ScrubDemo,
  spark: SparkDemo,
  stepper: StepperDemo,
  "view-transitions": ViewTransitionsDemo,
  zoom: ZoomDemo,
};
