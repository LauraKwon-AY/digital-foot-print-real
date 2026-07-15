import store from "./_store.js";
import { parseCookies } from "./_auth.js";

function requireSession(req, res) {
  const sid = parseCookies(req).dfm_sid;
  const session = sid ? store.sessions.get(sid) : null;
  if (!session) {
    res.status(401).json({ error: "Login required" });
    return null;
  }
  return session;
}

export default function handler(req, res) {
  const session = requireSession(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const record = store.history.get(session.sub) || { items: [], savedAt: null };
    res.json(record);
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const cleaned = items
    .map((item) => ({
      domain: String(item?.domain || "").trim().toLowerCase().replace(/^@/, ""),
      count: Math.max(0, Number(item?.count) || 0),
    }))
    .filter((item) => item.domain && item.domain.includes("."));

  const record = {
    items: cleaned,
    savedAt: new Date().toISOString(),
  };
  store.history.set(session.sub, record);
  res.json({ ok: true, saved: cleaned.length, savedAt: record.savedAt });
}
