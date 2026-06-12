# Design Prompt Generator — LNMB Homepage

After you have `research-output.md` saved in this folder, paste the prompt below into Claude, **and attach/paste the full contents of `research-output.md` along with it**. Claude will combine the research findings with LNMB's actual brand and content context to produce a single, ready-to-use design prompt for Stitch (or Claude, if Stitch isn't available).

---

```
You are helping design a new homepage for LNMB ("Leave No Medic Behind"), a
Kenyan nonprofit operating as the Prof Hassan Saidi Memorial Educational Fund.
LNMB funds tuition, accommodation, and meals for medical students in need,
primarily through an annual charity run event called "Strides of Compassion".

I'm attaching a deep-research report on what makes landing pages effective for
cause-driven/nonprofit organizations. Read it carefully.

Here is LNMB's current context:

- Current homepage sections: a hero with an image carousel of charity run
  photos, headline "Leave No Medic Behind" with "Strides of Compassion" as a
  script-style sub-brand, and two CTAs ("Get a T-Shirt" -> /register,
  "Read Our Story" -> /story); an "Impact Snapshot" stats section (year
  started 2017, biggest fundraiser = the annual charity run, 1,000+
  participants annually, 50+ students helped) plus a "Medics Unite" blurb
  about the memorial fund and a section on governance/accountability; an
  "About the Cause" section with the founding story and a "Learn More" CTA
  to /story.
- Unused/disabled homepage sections that exist in code and could be revived:
  a "mission" section, a "social" section (social media / community), a
  generic "cta" section, and a "highlights" section.
- Key destination pages: /shop (charity run registration & t-shirt purchase,
  multi-step mobile-first flow), /story (origin story, timeline, governance),
  /team, /partners, /highlights, /contact, /register.
- Brand constraints (must follow exactly, see docs/colors.md): only these
  colors - Navy #2D3748 (primary), Cyan #38BDF8 (accent), Red #EF4444
  (destructive/highlight), Black #1A202C (text), White #FFFFFF (background).
  No gradients. No arbitrary/AI-generated colors.

Using the research findings plus this context, write a single, concrete,
well-structured design prompt that I can paste into Stitch
(https://stitch.withgoogle.com) to generate homepage design concepts. The
prompt should:

- Describe the homepage layout section-by-section (hero, impact/social proof,
  mission/story, testimonials or highlights, final CTA), informed by what the
  research says works best.
- Specify tone and visual style (clean, trustworthy, mobile-first, photo-driven
  given the charity run imagery).
- Explicitly state the brand color constraints above and that no gradients or
  off-brand colors should be used.
- State the primary goals: drive registrations/merchandise purchases for the
  charity run via /shop, and build enough trust/credibility to support
  donations and partnerships.
- Be a single self-contained prompt (not a list of options), ready to paste
  directly into a design tool.

At the end, add one short note: "If Stitch is unavailable, this same prompt
can be pasted into Claude (e.g. Claude.ai or Claude Code) to generate design
mockups or code instead."
```

---

Save Claude's output as `docs/homepage-redesign/stitch-design-prompt.md`, then follow the instructions in [`README.md`](./README.md) for the design step.
