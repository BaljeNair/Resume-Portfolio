# Operations Lab plan

## Goal
Add three recruiter-facing personal projects to the existing static portfolio without changing its visual language or claiming professional production ownership:

1. Endpoint Refresh Readiness Checker
2. Joiner–Mover–Leaver Workflow Simulator
3. IT Support Knowledge Assistant

Each project is a self-contained static route under `projects/`, uses synthetic/anonymised data, includes a concise README and Problem / Approach / Tools / Outcome content, and is linked from a new homepage `Personal Projects / Operations Lab` section.

## Implementation

- Reuse the existing dark navy / lime portfolio palette, Manrope + DM Mono typography, header conventions, and responsive behavior.
- Keep each project dependency-free and runnable from the repository's static server.
- Add a shared `projects/project.css` for the project shell, cards, status labels, responsive layout, and accessible controls.
- Add one HTML, CSS/JS implementation per project with local deterministic data:
  - Readiness checker: CSV-like device records, filters, readiness scoring, summary counts, and CSV export.
  - JML simulator: role-based joiner/mover/leaver form, task checklist, status progression, and audit timeline.
  - Knowledge assistant: curated troubleshooting articles, keyword search, suggested prompts, source article display, and explicit unknown-answer behavior.
- Add project-specific READMEs describing the problem, approach, tools, outcome, synthetic-data disclaimer, and local run instructions.
- Add homepage cards that link to each project route. Keep professional case studies separate from personal projects.
- Add route entries to `sitemap.xml` and `manus-routes.json` if the host expects the route manifest.
- Add screenshot assets only after rendering the working pages; do not use generated mockups as evidence of functionality.

## Design

Use a restrained "operations console" movement: editorial portfolio typography paired with compact system readouts, evidence cards, status chips, and clear action controls. Keep lime as the ownership signal, amber/red only for operational states, and generous dark space around dense tool output. The interaction model should make the user feel like they are inspecting a real support workflow, while all data remains clearly marked as synthetic.

## Scope boundary

Do not create external GitHub repositories or publish independently during this task. Prepare repository-ready folders and links in the existing GitHub repository. The owner can split projects into separate repositories later if desired.
