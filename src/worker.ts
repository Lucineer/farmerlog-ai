// ═══════════════════════════════════════════════════════════════
// farmerlog-ai — AI Farming Companion
// Crop planning, soil health, livestock management
// Fleet vessel — https://github.com/Lucineer/farmerlog-ai
// Superinstance & Lucineer (DiGennaro et al.)
// ═══════════════════════════════════════════════════════════════

interface Env { STATE: KVNamespace; DEEPSEEK_API_KEY?: string; MOONSHOT_API_KEY?: string; DEEPINFRA_API_KEY?: string; SILICONFLOW_API_KEY?: string; }

const PROVIDERS: Record<string, { url: string; model: string }> = {
  deepseek: { url: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' },
  moonshot: { url: 'https://api.moonshot.ai/v1/chat/completions', model: 'moonshot-v1-8k' },
  deepinfra: { url: 'https://api.deepinfra.com/v1/openai/chat/completions', model: 'deepseek-ai/DeepSeek-V3-0324' },
  siliconflow: { url: 'https://api.siliconflow.com/v1/chat/completions', model: 'deepseek-ai/DeepSeek-V3' },
};

async function chat(messages: any[], env: Env): Promise<string> {
  for (const [name, key] of [['DEEPSEEK_API_KEY', env.DEEPSEEK_API_KEY], ['MOONSHOT_API_KEY', env.MOONSHOT_API_KEY], ['DEEPINFRA_API_KEY', env.DEEPINFRA_API_KEY], ['SILICONFLOW_API_KEY', env.SILICONFLOW_API_KEY]]) {
    if (key) {
      const provider = PROVIDERS[name.replace('_API_KEY', '').toLowerCase()];
      const r = await fetch(provider.url, { method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: provider.model, messages, max_tokens: 4000 }) });
      if (r.ok) { const d = await r.json(); return d.choices?.[0]?.message?.content || 'No response'; }
    }
  }
  return 'Error: No LLM provider configured. Add a key in Cloudflare Secrets Store.';
}

const COLOR = '#22c55e';
const TITLE = 'AI Farming Companion';
const HTML = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Farming Companion</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh}a{color:#22c55e;text-decoration:none}.hero{min-height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:4rem 2rem}.hero h1{font-size:clamp(2rem,5vw,3.5rem);color:#22c55e;margin-bottom:1rem}.hero p{color:#94a3b8;max-width:500px;line-height:1.6;margin-bottom:2rem}.btn{display:inline-block;padding:.75rem 2rem;border-radius:8px;font-weight:600;transition:all .2s}.btn-primary{background:#22c55e;color:#0a0a0f}.btn-primary:hover{opacity:.85}.links{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;margin-top:1rem}.card{background:#1a1a2e;border:1px solid #2a2a4a;border-radius:12px;padding:2rem;margin:1rem;max-width:400px}.cards{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;padding:2rem}.section{padding:4rem 2rem;text-align:center}footer{padding:2rem;text-align:center;color:#475569;font-size:.85rem}</style></head><body><div class="hero"><h1>AI Farming Companion</h1><p>Crop planning, soil health, livestock management. Part of the Lucineer fleet.</p><div class="links"><a href="/setup" class="btn btn-primary">Setup</a><a href="https://github.com/Lucineer/farmerlog-ai" class="btn" style="border:1px solid #2a2a4a">GitHub</a><a href="https://github.com/Lucineer/capitaine" class="btn" style="border:1px solid #2a2a4a">Fleet</a></div></div><div class="section"><h2 style="color:#22c55e;margin-bottom:1rem">Fleet Standard Routes</h2><div class="cards"><div class="card"><h3>/health</h3><p style="color:#94a3b8;margin-top:.5rem">Health check endpoint</p></div><div class="card"><h3>/setup</h3><p style="color:#94a3b8;margin-top:.5rem">BYOK provider setup</p></div><div class="card"><h3>/api/chat</h3><p style="color:#94a3b8;margin-top:.5rem">Chat with BYOK model</p></div><div class="card"><h3>/api/seed</h3><p style="color:#94a3b8;margin-top:.5rem">Seed data management</p></div></div></div><footer>Superinstance & Lucineer (DiGennaro et al.) &middot; <a href="https://github.com/orgs/Lucineer/repositories">Fleet</a></footer></body></html>';

const SETUP_HTML = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Setup</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0a0a0f;color:#e2e8f0;padding:2rem;max-width:600px;margin:0 auto}h1{color:#22c55e;margin-bottom:1rem}a{color:#22c55e}p{color:#94a3b8;line-height:1.6;margin-bottom:1rem}code{background:#1a1a2e;padding:.2rem .5rem;border-radius:4px;font-size:.9rem}ol{color:#94a3b8;padding-left:1.5rem;line-height:2}li a{color:#22c55e}</style></head><body><h1>Setup AI Farming Companion</h1><p>Add your LLM API key via Cloudflare Secrets Store:</p><ol><li>Go to <a href="https://dash.cloudflare.com">Cloudflare Dashboard</a></li><li>Navigate to Workers &rarr; farmerlog-ai &rarr; Settings &rarr; Variables</li><li>Add one or more secrets:<br><code>DEEPSEEK_API_KEY</code> — DeepSeek (recommended)<br><code>MOONSHOT_API_KEY</code> — Moonshot/Kimi<br><code>DEEPINFRA_API_KEY</code> — DeepInfra<br><code>SILICONFLOW_API_KEY</code> — SiliconFlow</li><li>Visit <a href="/health">/health</a> to verify</li></ol><p style="margin-top:2rem"><a href="/">Back to home</a></p></body></html>';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const j = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:*;";

    if (path === '/') return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp } });
    if (path === '/health') return new Response(JSON.stringify({ status: 'ok', vessel: 'farmerlog-ai', timestamp: Date.now() }), { headers: j });
    if (path === '/setup') return new Response(SETUP_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp } });

    if (path === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const messages = [{ role: 'system', content: 'You are AI Farming Companion. Crop planning, soil health, livestock management. Be helpful and concise.' }, ...(body.messages || [{ role: 'user', content: body.message || 'Hello' }])];
        const reply = await chat(messages, env);
        return new Response(JSON.stringify({ response: reply }), { headers: j });
      } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: j }); }
    }

    if (path === '/api/seed' && request.method === 'POST') {
      try {
        const body = await request.json();
        const key = body.key || 'default';
        await env.STATE.put('seed:' + key, JSON.stringify(body.value || body));
        return new Response(JSON.stringify({ status: 'seeded', key }), { headers: j });
      } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: j }); }
    }

    if (path === '/api/seed' && request.method === 'GET') {
      const keys = await env.STATE.list({ prefix: 'seed:' });
      const seeds: Record<string, string> = {};
      for (const k of keys.keys) { seeds[k.name.replace('seed:', '')] = await env.STATE.get(k.name) || ''; }
      return new Response(JSON.stringify({ seeds }), { headers: j });
    }

    return new Response('Not found', { status: 404 });
  },
};
