import state from "./_state.js";
import { parseCookies } from "./_auth.js";

export default function handler(req, res) {
  const sid = parseCookies(req).dfm_sid;
  const session = sid ? state.sessions.get(sid) : null;

  if (!session) {
    res.json({ loggedIn: false });
    return;
  }

  res.json({
    loggedIn: true,
    email: session.email,
    name: session.name,
    picture: session.picture || null,
  });
}
