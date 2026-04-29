import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";

// Local:      TURSO_DATABASE_URL=file:.data/site.db  (default, no token needed)
// Production: TURSO_DATABASE_URL=libsql://your-db.turso.io  +  TURSO_AUTH_TOKEN=...
let _client: Client | null = null;

function getClient(): Client {
  if (_client) return _client;
  const url =
    process.env.TURSO_DATABASE_URL ??
    (process.env.NODE_ENV === "production" ? "file:/tmp/site.db" : "file:.data/site.db");
  _client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  return _client;
}

let _init: Promise<void> | null = null;

function init(): Promise<void> {
  if (_init) return _init;
  _init = getClient()
    .batch([
      { sql: `CREATE TABLE IF NOT EXISTS stats (slug TEXT PRIMARY KEY, views INTEGER NOT NULL DEFAULT 0, likes INTEGER NOT NULL DEFAULT 0)` },
      { sql: `CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, source TEXT, created_at TEXT DEFAULT (datetime('now')))` },
    ])
    .then(() => undefined)
    .catch(() => { _init = null; });
  return _init!;
}

export async function getStats(slug: string): Promise<{ views: number; likes: number }> {
  try {
    await init();
    const res = await getClient().execute({ sql: "SELECT views, likes FROM stats WHERE slug = ?", args: [slug] });
    const row = res.rows[0];
    if (!row) return { views: 0, likes: 0 };
    return { views: Number(row.views), likes: Number(row.likes) };
  } catch {
    return { views: 0, likes: 0 };
  }
}

export async function incrementViews(slug: string): Promise<number> {
  try {
    await init();
    await getClient().execute({
      sql: "INSERT INTO stats (slug, views) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET views = views + 1",
      args: [slug],
    });
    return (await getStats(slug)).views;
  } catch {
    return 0;
  }
}

export async function toggleLike(slug: string, action: "like" | "unlike"): Promise<number> {
  try {
    await init();
    const delta = action === "like" ? 1 : -1;
    await getClient().execute({
      sql: "INSERT INTO stats (slug, likes) VALUES (?, MAX(0, ?)) ON CONFLICT(slug) DO UPDATE SET likes = MAX(0, likes + ?)",
      args: [slug, Math.max(0, delta), delta],
    });
    return (await getStats(slug)).likes;
  } catch {
    return 0;
  }
}

export async function getAllStats(): Promise<Record<string, { views: number; likes: number }>> {
  try {
    await init();
    const res = await getClient().execute("SELECT slug, views, likes FROM stats WHERE views > 0 OR likes > 0");
    const out: Record<string, { views: number; likes: number }> = {};
    for (const row of res.rows) {
      out[String(row.slug)] = { views: Number(row.views), likes: Number(row.likes) };
    }
    return out;
  } catch {
    return {};
  }
}

export async function subscribeEmail(email: string, source = "site"): Promise<"ok" | "exists" | "error"> {
  try {
    await init();
    const existing = await getClient().execute({ sql: "SELECT email FROM subscribers WHERE email = ?", args: [email] });
    if (existing.rows.length > 0) return "exists";
    await getClient().execute({ sql: "INSERT INTO subscribers (email, source) VALUES (?, ?)", args: [email, source] });
    return "ok";
  } catch {
    return "error";
  }
}
