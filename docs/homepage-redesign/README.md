# Homepage Redesign — Research & Design Prompt Kit

This folder contains a self-contained workflow for researching and designing
a new LNMB homepage, before any implementation work begins.

## Workflow

1. **Deep research.** Open [`01-deep-research-prompt.md`](./01-deep-research-prompt.md)
   and copy the prompt into Google's Deep Research (Gemini).
2. **Export research.** When the report is ready, export it as Markdown and
   save it here as `research-output.md`.
3. **Generate the design prompt.** Open
   [`02-design-prompt-generator.md`](./02-design-prompt-generator.md), paste
   that prompt into Claude along with the full contents of
   `research-output.md`. Claude will produce a single design prompt tailored
   to LNMB.
4. **Save the design prompt** as `stitch-design-prompt.md`.
5. **Generate designs.** Paste `stitch-design-prompt.md` into
   [Stitch](https://stitch.withgoogle.com) to generate homepage design
   concepts. If Stitch isn't available, paste the same prompt into Claude
   (Claude.ai or Claude Code) instead.

Track progress in [`TRACKER.md`](./TRACKER.md).

## Brand constraints

Whatever comes out of this process must stay within LNMB's brand system,
documented in [`../colors.md`](../colors.md):

- Colors: Navy `#2D3748` (primary), Cyan `#38BDF8` (accent), Red `#EF4444`
  (destructive/highlight), Black `#1A202C` (text), White `#FFFFFF`
  (background) — nothing else.
- No gradients, no arbitrary/AI-generated colors.

## Current homepage for reference

The current homepage (`src/app/page.tsx`) renders:

- **Hero** (`src/components/home/hero.tsx`) — image carousel, "Leave No
  Medic Behind" / "Strides of Compassion" branding, CTAs to `/register` and
  `/story`.
- **Impact Snapshot** (`src/components/home/impact.tsx`) — key stats and
  governance/accountability blurb.
- **About** (`src/components/home/about.tsx`) — founding story with a
  "Learn More" CTA to `/story`.

Unused components that exist and could be revived during the redesign:
`mission.tsx`, `home-social.tsx`, `cta.tsx`, `highlights.tsx` (all in
`src/components/home/`).
