/**
 * Cloudflare Worker — Anthropic API Proxy for balje.tech
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this entire file into the editor
 * 3. Click "Save and Deploy"
 * 4. Go to Settings → Variables → Add variable:
 *      Name:  ANTHROPIC_API_KEY
 *      Value: your_actual_key_here   ← get from https://console.anthropic.com
 *      Click "Encrypt" to hide it
 * 5. Note your Worker URL (e.g. https://bn-assistant.YOUR-NAME.workers.dev)
 * 6. In script.js, replace WORKER_URL value with your Worker URL
 */

const ALLOWED_ORIGINS = ['https://balje.tech', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : (origin.includes('localhost') || origin.includes('127.0.0.1') ? origin : ALLOWED_ORIGINS[0]);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Allow balje.tech and localhost for testing
    const isAllowed = origin === '' || origin.includes('balje.tech') || origin.includes('localhost') || origin.includes('127.0.0.1');
    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    // Forward to Anthropic
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-6',
        max_tokens: body.max_tokens || 1000,
        system: body.system,
        messages: body.messages,
      }),
    });

    const data = await anthropicRes.json();

    return new Response(JSON.stringify(data), {
      status: anthropicRes.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
      },
    });
  },
};
