import { githubRequest } from "./github-api.mjs";
import { readFile, writeFile } from "node:fs/promises";
const action = process.argv[2] ?? "status";
if (action === "configure-workflow") {
  const before = await githubRequest("/pages");
  if (before.cname !== "santensor.com" || !before.https_enforced)
    throw new Error(
      "Unexpected domain/HTTPS configuration; refusing to change publishing source",
    );
  await githubRequest("/pages", {
    method: "PUT",
    body: { build_type: "workflow" },
  });
  const after = await githubRequest("/pages");
  if (
    after.cname !== before.cname ||
    after.https_enforced !== before.https_enforced ||
    after.build_type !== "workflow"
  )
    throw new Error("Pages configuration verification failed");
  await writeFile(
    "evidence/v4-production/pages-workflow.json",
    JSON.stringify(
      { at: new Date().toISOString(), before, after, dnsWrites: false },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      build_type: after.build_type,
      cname: after.cname,
      https_enforced: after.https_enforced,
    }),
  );
} else if (action === "status") {
  const [pages, runs] = await Promise.all([
    githubRequest("/pages"),
    githubRequest("/actions/runs?branch=main&per_page=2"),
  ]);
  console.log(
    JSON.stringify(
      {
        pages,
        runs: runs.workflow_runs.map(
          ({ id, head_sha, status, conclusion, html_url }) => ({
            id,
            head_sha,
            status,
            conclusion,
            html_url,
          }),
        ),
      },
      null,
      2,
    ),
  );
} else throw new Error("Use status or configure-workflow");
