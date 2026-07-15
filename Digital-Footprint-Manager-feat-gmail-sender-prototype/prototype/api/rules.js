import store from "./_store.js";
import { parseCookies } from "./_auth.js";

export default function handler(req, res) {
  const sid = parseCookies(req).dfm_sid;
  if (!sid || !store.sessions.get(sid)) {
    res.status(401).json({ error: "Login required" });
    return;
  }

  res.json({
    rules: store.rules,
  });
}
