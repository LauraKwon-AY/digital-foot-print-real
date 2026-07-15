import state from "../_state.js";
import { clearSessionCookie, parseCookies } from "../_auth.js";

export default function handler(req, res) {
  const sid = parseCookies(req).dfm_sid;
  if (sid) state.sessions.delete(sid);
  clearSessionCookie(res);
  res.json({ ok: true });
}
