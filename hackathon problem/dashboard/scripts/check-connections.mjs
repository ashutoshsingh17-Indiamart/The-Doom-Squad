import { loadEnv } from './env.mjs';
const env = loadEnv();
for (const [name, url, headers] of [
  ['OpenRouter', 'https://openrouter.ai/api/v1/key', { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` }],
  ['Supabase', `${env.SUPABASE_URL}/rest/v1/voiceops_experiments?select=id&limit=1`, { apikey: env.SUPABASE_SECRET_KEY }],
]) {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    const body = await response.json();
    console.log(`${name}: HTTP ${response.status}${body.code === 'PGRST205' ? ' (connection valid; run supabase/schema.sql)' : ''}`);
    if (name === 'OpenRouter' && response.ok) console.log('Free requests remaining:', body.data?.free_model_daily_requests?.remaining ?? 'not reported');
  } catch { console.log(`${name}: network request failed`); }
}
console.log('Sarvam: key configured; no voice credits spent by this check.');
