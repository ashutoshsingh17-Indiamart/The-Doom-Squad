import { loadEnv } from './env.mjs';
const env = loadEnv();
for (const [name, url, headers] of [
  ['Supabase', `${env.SUPABASE_URL}/rest/v1/voiceops_experiments?select=id&limit=1`, { apikey: env.SUPABASE_SECRET_KEY }],
]) {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    const body = await response.json();
    console.log(`${name}: HTTP ${response.status}${body.code === 'PGRST205' ? ' (connection valid; run supabase/schema.sql)' : ''}`);
  } catch { console.log(`${name}: network request failed`); }
}
console.log(`Sarvam: ${env.SARVAM_API_KEY ? 'key configured' : 'SARVAM_API_KEY missing'}; no credits spent by this check.`);
