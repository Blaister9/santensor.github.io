# GitHub Pages preservation and release

Existing repository: https://github.com/Blaister9/santensor.github.io
Feature branch: `feat/santensor-commercial-20261015`.
Verified baseline: `22e06ba3aaaad1f54f99384a806f9925a3b35b21`.
Rollback branch: `rollback/pre-santensor-20261015`.
Existing Pages mode: legacy source build; HTTPS enforced; `CNAME` remains exactly `santensor.com`. DNS, registrar and custom-domain settings are not changed.

Validation:

```
npm ci
npm audit
npm run lint
npm test
npm run build
npm run test:e2e
node scripts/audit.mjs
```

The static build emits `dist/` for local and candidate checks. GitHub Pages continues serving the root static source from its existing configuration. The new workflow only validates and uploads evidence; it does not change Pages configuration.

Public HTTPS candidate: https://trainer-web-production-f2e9.up.railway.app/commercial-preview/
This uses the already isolated trainer service, not another Railway project or production domain. Generate it with `node scripts/stage-preview.mjs` after building; the trainer deploy must then reach SUCCESS. Candidate HTML paths receive a prefix; production paths remain rooted at santensor.com.

Release gate: passing feature CI, public candidate browser/HTTP checks, preserved CNAME and a reachable baseline. Keep the known-good rollback branch/tag. Merge through the PR only after these checks; otherwise leave production intact. Observe the actual Pages build outcome and smoke all production routes after release. If it fails, create a normal revert commit/PR to the known-good version; never force-push or change DNS.

The rollback snapshot can be served independently from the preserved branch without modifying the working branch. No production rollback is claimed unless actually exercised. Reports distinguish a prepared rollback from proven zero-downtime deployment behavior.
