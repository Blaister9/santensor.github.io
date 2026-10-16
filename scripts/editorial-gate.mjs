export function assertPublishable(pages) {
 const pending = pages.flatMap(({path,html}) => {
  const issues = [];
  if (/data-editorial-placeholder|\[(?:HERO|CASE)_[A-Z_]+:/.test(html)) issues.push('unresolved editorial content');
  if (/class="preview-ribbon"|name="robots" content="noindex/.test(html)) issues.push('design preview');
  return issues.length ? [`${path}: ${issues.join(', ')}`] : [];
 });
 if (pending.length) throw new Error(`Production build blocked. Review and resolve the preview before publication.\n${pending.join('\n')}`);
}
