import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type Section = "articles" | "tutoriels" | "insights" | "devlog" | "ressources";

export const SECTIONS: Section[] = ["articles", "tutoriels", "insights", "devlog", "ressources"];

export const SECTION_LABELS: Record<Section, string> = {
  articles: "Articles",
  tutoriels: "Tutoriels",
  insights: "Insights",
  devlog: "Devlog",
  ressources: "Ressources",
};

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PostFrontmatter = {
  title: string;
  date?: string;
  updated?: string;
  tags?: string[];
  status?: string;
  format?: string;
  description?: string;
  tldr?: string;
  takeaways?: string[];
  github?: string;
  npm?: string;
  related?: string[];
};

export type Post = {
  slug: string;
  section: Section;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
  url: string;
  excerpt: string;
};

function getExcerpt(description: string | undefined, content: string, maxLength = 130): string {
  if (description) return description.length > maxLength ? description.slice(0, maxLength).replace(/\s+\S*$/, "") + "…" : description;
  const stripped = content
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~#>|]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

// Derive a clean slug from a filename (strip date prefix, extension)
function toSlug(filename: string): string {
  return filename
    .replace(/\.(md|mdx)$/, "")
    // strip YYYYMMDD-HHMM- prefix if present
    .replace(/^\d{8}-\d{4}-/, "");
}

export function getPostsForSection(section: Section): Post[] {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const slug = toSlug(filename);

      const fm = data as PostFrontmatter;
      return {
        slug,
        section,
        frontmatter: fm,
        content,
        readingTime: readingTime(content).text,
        url: `/${section}/${slug}`,
        excerpt: getExcerpt(fm.description, content),
      };
    })
    .filter((p) => p.frontmatter.status !== "archived")
    .sort((a, b) => {
      const da = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const db = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return db - da;
    });
}

export function getAllPosts(): Post[] {
  return SECTIONS.flatMap(getPostsForSection);
}

export function getPostBySlug(section: Section, slug: string): Post | null {
  const posts = getPostsForSection(section);
  return posts.find((p) => p.slug === slug) ?? null;
}

// Build a global slug → Post manifest for cross-link resolution
export function buildPostManifest(): Map<string, Post> {
  const manifest = new Map<string, Post>();
  for (const post of getAllPosts()) {
    manifest.set(post.slug, post);
    // also index by filename slug variants
    manifest.set(`${post.slug}.md`, post);
    manifest.set(`${post.slug}.mdx`, post);
  }
  return manifest;
}

export function getRelatedPosts(post: Post): Post[] {
  if (!post.frontmatter.related?.length) return [];
  const manifest = buildPostManifest();
  return post.frontmatter.related
    .map((ref) => manifest.get(ref) ?? manifest.get(`${ref}.md`))
    .filter((p): p is Post => p !== undefined)
    .slice(0, 5);
}

// Recent posts across all sections, capped
export function getRecentPosts(limit = 20): Post[] {
  return getAllPosts()
    .filter((p) => p.frontmatter.date)
    .slice(0, limit);
}
