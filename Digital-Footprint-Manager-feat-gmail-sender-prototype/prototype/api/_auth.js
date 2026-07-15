import { OAuth2Client } from "google-auth-library";

export function getClientId() {
  return process.env.GOOGLE_CLIENT_ID || "";
}

export function getOauthClient() {
  const clientId = getClientId();
  return clientId ? new OAuth2Client(clientId) : null;
}

export function parseCookies(req) {
  const raw = req.headers.cookie || "";
  const out = {};
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("=") || "");
  }
  return out;
}

export function setSessionCookie(res, sid) {
  res.setHeader("Set-Cookie", `dfm_sid=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Lax`);
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", "dfm_sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}
