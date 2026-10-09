import {readdirSync,readFileSync} from 'node:fs';
import {loadEnv} from './env.mjs';
const env=loadEnv();
const files=readdirSync('dist/assets').filter(f=>/\.(js|css)$/.test(f));
const bundled=files.map(f=>readFileSync(`dist/assets/${f}`,'utf8')).join('\n');
const leaked=['SARVAM_API_KEY','OPENROUTER_API_KEY','SUPABASE_SECRET_KEY'].some(key=>env[key]&&bundled.includes(env[key]));
console.log(`Frontend credential scan: ${leaked?'FAILED':'clean'}`);
if(leaked)process.exitCode=1;
