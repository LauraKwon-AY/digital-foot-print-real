import crypto from "node:crypto";
import store from "../_store.js";
import { getClientId, getOauthClient, setSessionCookie } from "../_auth.js";

export default async function handler(req, res) {
  try {
    const clientId = getClientId();
    const oauthClient = getOauthClient();
    if (!oauthClient || !clientId) {
      res.status(500).json({ error: "GOOGLE_CLIENT_ID missing" });
      return;
    }

    const credential = String(req.body?.credential || "");
    if (!credential) {
      res.status(400).json({ error: "credential required" });
      return;
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      res.status(401).json({ error: "Invalid Google ID token" });
      return;
    }

    const sid = crypto.randomUUID();
    store.sessions.set(sid, {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture,
      createdAt: Date.now(),
    });
    setSessionCookie(res, sid);

    res.json({
      loggedIn: true,
      email: payload.email,
      name: payload.name || payload.email,
    });
  } catch (err) {
    res.status(401).json({ error: err.message || "Login failed" });
  }
}
