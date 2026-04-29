import path from "path";
import fs from "fs";

// Uses node:sqlite (built-in Node.js 22.5+). Falls back to no-op if unavailable.
// For persistent views in production, replace with Turso: https://turso.tech
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDb(): any {
  if (_db !== undefined && _db !== null) return _db;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    const dir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(process.cwd(), ".data");
    fs.mkdirSync(dir, { recursive: true });
    _db = new DatabaseSync(path.join(dir, "views.db"));
    _db.exec(
      "CREATE TABLE IF NOT EXISTS views (slug TEXT PRIMARY KEY, count INTEGER DEFAULT 0)"
    );
    return _db;
  } catch {
    _db = null;
    return null;
  }
}

export function getViewCount(slug: string): number {
  const db = getDb();
  if (!db) return 0;
  try {
    const row = db.prepare("SELECT count FROM views WHERE slug = ?").get(slug) as
      | { count: number }
      | undefined;
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

export function incrementView(slug: string): number {
  const db = getDb();
  if (!db) return 0;
  try {
    db
      .prepare(
        "INSERT INTO views (slug, count) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET count = count + 1"
      )
      .run(slug);
    return getViewCount(slug);
  } catch {
    return 0;
  }
}
