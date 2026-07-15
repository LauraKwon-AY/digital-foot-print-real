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

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const senders = Array.isArray(req.body?.senders) ? req.body.senders : [];
  const domainMap = new Map();

  for (const sender of senders) {
    const email = String(sender?.email || "").trim().toLowerCase();
    const domain = String(sender?.domain || email.split("@")[1] || "").trim().toLowerCase();
    if (!domain || !domain.includes(".")) continue;
    domainMap.set(domain, (domainMap.get(domain) || 0) + Math.max(0, Number(sender?.count) || 0));
  }

  const items = [...domainMap.entries()]
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);

  store.history.set(session.sub, {
    items,
    savedAt: new Date().toISOString(),
  });

  res.json({
    ok: true,
    items,
    totalDomains: items.length,
  });
}
