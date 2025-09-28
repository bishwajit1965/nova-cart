// utils/formatBreadcrumb.js
export function formatBreadcrumb(pathname) {
  return pathname
    .split("/") // break into segments
    .filter(Boolean) // remove empty strings
    .map(
      (segment) =>
        segment
          .replace(/-/g, " ") // replace dashes with spaces
          .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize each word
    )
    .join(" / "); // join as breadcrumb
}
