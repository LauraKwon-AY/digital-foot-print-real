import state from "./_state.js";
import { parseCookies } from "./_auth.js";

export default function handler(req, res) {
  const sid = parseCookies(req).dfm_sid;
  const session = sid ? state.sessions.get(sid) : null;
  if (!session) {
    res.status(401).json({ error: "Login required" });
    return;
  }

  if (req.method === "GET") {
    const record = state.savedCandidates.get(session.sub) || { domains: [], savedAt: null };
    res.json(record);
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const domains = Array.isArray(req.body?.domains) ? req.body.domains : [];
  const cleaned = [];
  const seen = new Set();

  for (const item of domains) {
    const domain = String(item?.domain || item || "")
      .trim()
      .toLowerCase()
      .replace(/^@/, "");
    if (!domain || !domain.includes(".") || seen.has(domain)) continue;
    if (domain.length > 253) continue;
    seen.add(domain);
    cleaned.push({
      domain,
      count: Math.max(0, Number(item?.count) || 0),
    });
  }

  if (cleaned.length > 2000) {
    res.status(400).json({ error: "Too many domains" });
    return;
  }

  const record = { domains: cleaned, savedAt: new Date().toISOString() };
  state.savedCandidates.set(session.sub, record);
  res.json({ ok: true, saved: cleaned.length, savedAt: record.savedAt });
}
