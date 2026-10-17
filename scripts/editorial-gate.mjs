export function assertPublishable(pages) {
  const pending = pages.flatMap(({ path, html }) => {
    const issues = [];
    if (/data-editorial-placeholder|\[(?:HERO|CASE)_[A-Z_]+:/.test(html))
      issues.push("unresolved editorial content");
    if (
      /class="(?:preview-ribbon|preview-label)\b|name="robots" content="noindex/.test(
        html,
      )
    )
      issues.push("design preview");
    if (/trycloudflare\.com|data-debug|\[(?:HERO|CASE)_[A-Z_]+:/.test(html))
      issues.push("internal or unfinished content");
    return issues.length ? [`${path}: ${issues.join(", ")}`] : [];
  });
  if (pending.length)
    throw new Error(
      `Production build blocked. Review and resolve the preview before publication.\n${pending.join("\n")}`,
    );
}
