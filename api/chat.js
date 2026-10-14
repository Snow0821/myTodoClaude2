// Vercel Function: relays chat messages to OpenRouter and streams back plain text.
// Env: OPENROUTER_API_KEY (required), OPENROUTER_MODEL (optional).
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST만 지원합니다." });
  }
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: "서버에 OPENROUTER_API_KEY 환경 변수가 없습니다." });

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const system = typeof body.system === "string" ? body.system.slice(0, 8000) : "";
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "마지막 메시지는 사용자 메시지여야 합니다." });
  }

  let upstream;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://" + (req.headers.host || "mytodoclaude2.vercel.app"),
        "X-Title": "My Todo Notebook",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        stream: true,
        messages: system ? [{ role: "system", content: system }, ...messages] : messages,
      }),
    });
  } catch (e) {
    return res.status(502).json({ error: "OpenRouter에 연결하지 못했습니다." });
  }
  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    const msg = safeParse(text)?.error?.message || text.slice(0, 300) || upstream.statusText;
    return res.status(upstream.status === 429 ? 429 : 502).json({ error: "OpenRouter 오류 (" + upstream.status + "): " + msg });
  }

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" });
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith("data:")) continue; // skips ": OPENROUTER PROCESSING" keep-alives
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        const json = safeParse(data);
        if (json?.error) res.write("\n[오류] " + (json.error.message || "응답 중 오류가 발생했습니다."));
        const delta = json?.choices?.[0]?.delta?.content;
        if (delta) res.write(delta);
      }
    }
  } catch (e) {
    res.write("\n[오류] 응답이 중간에 끊겼습니다.");
  }
  res.end();
};

function safeParse(s) {
  try { return JSON.parse(s); } catch (e) { return null; }
}
