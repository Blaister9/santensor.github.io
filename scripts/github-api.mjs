// Uses the existing Git credential helper in memory. Never prints or persists credentials.
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
const repository = "Blaister9/santensor.github.io";
export async function githubRequest(
  endpoint,
  { method = "GET", body, authenticated = true } = {},
) {
  if (!endpoint.startsWith("/") || endpoint.includes("://"))
    throw new Error("Repository-relative endpoint required");
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
  };
  if (authenticated) {
    const result = spawnSync("git", ["credential", "fill"], {
      input: "protocol=https\nhost=github.com\n\n",
      encoding: "utf8",
      windowsHide: true,
    });
    if (result.status !== 0)
      throw new Error("Existing GitHub credential helper is unavailable");
    const credential = Object.fromEntries(
      result.stdout
        .trim()
        .split(/\r?\n/)
        .map((line) => {
          const i = line.indexOf("=");
          return [line.slice(0, i), line.slice(i + 1)];
        }),
    );
    if (!credential.password)
      throw new Error("GitHub authentication is missing");
    headers.Authorization = `Bearer ${credential.password}`;
  }
  const response = await fetch(
    `https://api.github.com/repos/${repository}${endpoint}`,
    { method, headers, body: body ? JSON.stringify(body) : undefined },
  );
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok)
    throw new Error(
      `GitHub ${method} ${endpoint}: ${response.status} ${data?.message ?? ""}`,
    );
  return data;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const endpoint = process.argv[2] ?? "/pages";
  const data = await githubRequest(endpoint);
  console.log(JSON.stringify(data, null, 2));
}
