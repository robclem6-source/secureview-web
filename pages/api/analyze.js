export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: ANTHROPIC_API_KEY is not set.' });
  }

  const { content, system, max_tokens } = req.body || {};

  if (!content) {
    return res.status(400).json({ error: 'Request body must include "content" (string or content-block array).' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: max_tokens || 1000,
        ...(system ? { system } : {}),
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({
        error: data?.error?.message || 'Anthropic API request failed.',
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error calling Anthropic API:', err);
    return res.status(502).json({ error: 'Failed to reach Anthropic API.' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
  maxDuration: 60,
};
