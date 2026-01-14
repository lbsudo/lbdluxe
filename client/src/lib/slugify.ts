// client/src/lib/slugify.ts
/**
 * Convert a string (usually a blog post title) into a URL‑friendly slug.
 * Example: "My First Post!" => "my-first-post"
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // spaces/underscores → hyphens
    .replace(/[^\w-]+/g, "") // remove all non‑alphanumeric/hyphen chars
    .replace(/--+/g, "-"); // collapse multiple hyphens