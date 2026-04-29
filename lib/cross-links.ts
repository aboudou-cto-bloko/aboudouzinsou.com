import type { Plugin } from "unified";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import type { Link } from "mdast";
import { buildPostManifest } from "./content";

/**
 * Remark plugin: resolves relative ./slug.md links to absolute /section/slug routes.
 *
 * In the Brain drafts, cross-links look like:
 *   [Title](./insight-xof-pas-de-centimes.md)
 *
 * This plugin resolves them to:
 *   /insights/insight-xof-pas-de-centimes
 *
 * If a slug isn't found in the manifest, the link is left as-is.
 */
export const remarkResolveLinks: Plugin<[], Root> = () => {
  return (tree) => {
    const manifest = buildPostManifest();

    visit(tree, "link", (node: Link) => {
      const href = node.url;

      // Only process relative .md / .mdx links
      if (!href.startsWith("./") && !href.startsWith("../")) return;
      if (!href.endsWith(".md") && !href.endsWith(".mdx")) return;

      // Extract filename from ./path/to/file.md
      const filename = href.split("/").at(-1) ?? "";
      const slugWithExt = filename;
      const slug = slugWithExt.replace(/\.(md|mdx)$/, "");

      const post =
        manifest.get(slug) ??
        manifest.get(slugWithExt);

      if (post) {
        node.url = post.url;
      }
    });
  };
};
