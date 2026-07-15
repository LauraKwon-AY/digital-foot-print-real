import { getClientId } from "./_auth.js";

export default function handler(req, res) {
  const clientId = getClientId();
  if (!clientId) {
    res.status(500).json({ error: "GOOGLE_CLIENT_ID is not configured" });
    return;
  }

  res.json({
    clientId,
    maxMessages: Number(process.env.GMAIL_MAX_MESSAGES || 0),
    concurrency: Number(process.env.GMAIL_CONCURRENCY || 12),
    gmailScope: "https://www.googleapis.com/auth/gmail.readonly",
  });
}
