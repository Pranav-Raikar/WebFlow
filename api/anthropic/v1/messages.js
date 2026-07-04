// Vercel serverless function — deployed automatically at
// POST /api/anthropic/v1/messages
//
// This exists so the browser NEVER holds the Anthropic API key.
// The key lives only in the Vercel project's Environment Variables
// (Settings → Environment Variables → ANTHROPIC_API_KEY), which is
// read here on the server and never sent to the client.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set on the server.' });
    return;
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(502).json({ error: 'Upstream request to Anthropic failed.', detail: String(err) });
  }
}
