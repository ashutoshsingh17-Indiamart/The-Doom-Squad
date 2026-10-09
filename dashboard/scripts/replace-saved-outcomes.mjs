import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadEnv} from './env.mjs';
import {demoScenarios} from '../shared/demo-scenarios.mjs';
import {preparedExperiment,completeExperiment} from '../shared/experiment-run.mjs';

// Deliberate maintenance command, never part of app startup or ordinary replay.
// Write replacements first; delete only the exact old IDs captured in a backup.
if(!process.argv.includes('--replace'))throw new Error('Pass --replace to back up and replace the saved experiment history with six outcomes.');
const env=loadEnv();assert.ok(env.SUPABASE_URL&&env.SUPABASE_SECRET_KEY,'Supabase backend configuration is required.');
const base=env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1/voiceops_experiments',headers={apikey:env.SUPABASE_SECRET_KEY,'Content-Type':'application/json',Prefer:'return=representation,resolution=merge-duplicates'};
if(!env.SUPABASE_SECRET_KEY.startsWith('sb_secret_'))headers.Authorization=`Bearer ${env.SUPABASE_SECRET_KEY}`;
async function request(query='',method='GET',body){
 const response=await fetch(base+query,{method,headers,signal:AbortSignal.timeout(45000),...(body?{body:JSON.stringify(body)}:{})});
 if(!response.ok)throw new Error(`Saved-outcome maintenance failed (${method}, HTTP ${response.status}). Existing history backup is retained.`);
 return response.json();
}
const previous=[];
for(let offset=0;;offset+=500){const rows=await request(`?select=*&order=created_at.asc&limit=500&offset=${offset}`);previous.push(...rows);if(rows.length<500)break;}
const reference=Date.now(),stamp=new Date(reference).toISOString(),backup=resolve('work',`saved-outcomes-backup-${stamp.replace(/[:.]/g,'-')}.json`);
mkdirSync(resolve('work'),{recursive:true});writeFileSync(backup,JSON.stringify({backedUpAt:stamp,table:'voiceops_experiments',rows:previous},null,2)+'\n');
const replacements=demoScenarios.map((profile,i)=>{
 const id=`${String(97000001+i)}-0000-4000-8000-000000000001`,created_at=new Date(reference-i*60000).toISOString(),run=completeExperiment(preparedExperiment(profile.id,{id,startedAt:created_at,name:profile.name}));
 run.decisions=run.decisions.map(d=>({...d,at:new Date(Date.parse(created_at)+d.elapsedMinutes*60000).toISOString()}));
 return {id,name:run.name,status:run.status,scenario:run.scenario,payload:run,created_at,updated_at:stamp};
});
const inserted=await request('?on_conflict=id','POST',replacements);
assert.equal(inserted.length,6);for(const record of replacements)assert.ok(inserted.some(row=>row.id===record.id&&row.scenario===record.scenario&&row.payload.calls.length===record.payload.calls.length),'Replacement verification failed before removing old rows.');
const keep=new Set(replacements.map(r=>r.id)),remove=previous.map(r=>r.id).filter(id=>!keep.has(id));
for(let i=0;i<remove.length;i+=100){const ids=remove.slice(i,i+100);assert.ok(ids.every(id=>/^[0-9a-f-]{36}$/i.test(id)),'Invalid old row ID');await request(`?id=in.(${ids.join(',')})`,'DELETE');}
const saved=await request('?select=id,name,status,scenario,payload&order=created_at.desc&limit=1000');
assert.equal(saved.length,6,'History changed during replacement; review the backup before running maintenance again.');
assert.deepEqual(new Set(saved.map(r=>r.scenario)),new Set(demoScenarios.map(s=>s.id)));
console.log(JSON.stringify({removed:remove.length,saved:saved.map(r=>({name:r.name,scenario:r.scenario,calls:r.payload.calls.length,traffic:[r.payload.initial,...r.payload.decisions.map(d=>d.allocation)]})),backup:backup.replace(process.cwd(),'dashboard')},null,2));
