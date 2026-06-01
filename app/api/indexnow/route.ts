import { getAllPosts } from "@/lib/content";
import { PROJECTS } from "@/lib/projects";

const BASE = "https://aboudouzinsou.com";
const KEY = "9e641e3a276d83cc675912f445889c7b";

const STATIC_URLS = [
  BASE,
  `${BASE}/about`,
  `${BASE}/services`,
  `${BASE}/tarifs`,
  `${BASE}/projets`,
  `${BASE}/articles`,
  `${BASE}/tutoriels`,
  `${BASE}/insights`,
  `${BASE}/devlog`,
  `${BASE}/ressources`,
  `${BASE}/links`,
];

// Protéger avec un secret pour éviter les appels non autorisés
const SECRET = process.env.INDEXNOW_SECRET;

export async function POST(req: Request) {
  if (SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const posts = getAllPosts()
    .filter((p) => p.frontmatter.status === "published")
    .map((p) => `${BASE}${p.url}`);

  const projects = PROJECTS.map((p) => `${BASE}/projets/${p.slug}`);

  const urlList = [...STATIC_URLS, ...projects, ...posts];

  const body = {
    host: "aboudouzinsou.com",
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return Response.json({
    ok: res.ok,
    status: res.status,
    submitted: urlList.length,
    urls: urlList,
  });
}

// GET pour vérifier la configuration
export function GET() {
  const posts = getAllPosts().filter((p) => p.frontmatter.status === "published");
  return Response.json({
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    totalUrls: STATIC_URLS.length + PROJECTS.length + posts.length,
  });
}
