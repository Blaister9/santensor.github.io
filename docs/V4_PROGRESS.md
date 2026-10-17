# Santensor V4 — continuous cinematic experience

## Scope and repository audit

2026-10-16. Starting checkout `chore/release-evidence-20261015`, clean. Remote fetched before choosing a base. Remote `main`: `84e3c855af9cf112cdfdf4938e6197acdd40fea4`.

Base `origin/feat/santensor-v3-independent` at `5b463cb350e3d4c16fd956e053a66533f91d589a` retains bilingual routes, commercial content, the deterministic six-stage simulator, human review, error recovery, contact drafts, self-hosted fonts and tests. The older release branch lacks these additions. V3 visual concepts are not the visual basis of V4.

## Milestones

1. **Published and verified.** Created `feat/santensor-v4-cinematic-continuous`, pushed with upstream, and verified the remote ref at `5b463cb350e3d4c16fd956e053a66533f91d589a` before implementation.
2. **Implemented and rendered.** Original procedural glass archive, etched optical sheets, steel mounts, gold beam, reflective floor, persistent HTML glass surfaces, continuous camera and native scroll scrubbing. Chromium 1440×900: WebGL active, no JS/resource errors, 4,432 triangles, 369 draw calls (optimization reserved for milestone 6). Build, syntax checks and 16 domain/content tests pass. Screenshot: `evidence/v4/inspection/archive.png`.
3. Understanding and integration — pending.
4. Functional application transition — pending.
5. Results and commercial navigation — pending.
6. Bilingual, mobile, accessibility and resource verification — pending.
7. Isolated HTTPS preview and acceptance evidence — pending.

## Art direction and references

- https://scrollytelling.ai/ — consulted for scroll-controlled narrative progression.
- https://bruno-simon.com/ — consulted for spatial exploration and contextual interaction.
- https://weekend-kick-characterization-guam.trycloudflare.com/es/ — unavailable during audit. No original prototype assets were recovered. The owner's description of an optical archive, glass, dark industrial structures and gold directional light is the art brief.
- Existing repository screenshots document V2/V3 and unrelated references; they are historical comparisons, not recovered captures of the approved optical prototype.

## Architecture decision

One persistent procedural WebGL world with original geometry; a reversible scroll-controlled camera; three persistent HTML glass surfaces that transform into editable input, execution and evidence. WebGL is enhancement, not the application engine. Existing `createRun`/`stepRun` remain the executable domain model. Conceptual AI components are explicitly distinguished from the browser-local rule simulator.

No production, CNAME, DNS, trainer or Railway mutations. No paid services. Production build must remain blocked while the design awaits visual review.
