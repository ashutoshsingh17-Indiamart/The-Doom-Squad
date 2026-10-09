import {readFileSync,existsSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {personas,scriptedCall} from '../shared/domain.mjs';
import {createHash} from 'node:crypto';
mkdirSync('work',{recursive:true});const path='work/evaluator-cache.json';const cache=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
const calls=[...new Map(personas.flatMap(p=>[scriptedCall(p.id,'A'),scriptedCall(p.id,'B'),scriptedCall(p.id,'B','regression')]).map(c=>[c.key,c])).values()];
const signature=c=>createHash('sha256').update(JSON.stringify({turns:c.turns,product:c.product,version:2})).digest('hex');
const pending=[...new Map(calls.filter(c=>!cache[signature(c)]).map(c=>[signature(c),c])).values()];let done=Object.keys(cache).length;
for(let i=0;i<pending.length;i+=5){const batch=pending.slice(i,i+5);let result;
 for(let attempt=0;attempt<4;attempt++){
 const model=process.argv[2]||(attempt%2?'apodex/apodex-1.1-mini:free':'dots-studio/dots-3-note-preview:free');
 const r=await fetch('http://127.0.0.1:3000/api/evaluate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model,calls:batch.map(c=>({id:c.key,productId:c.product.id,turns:c.turns}))})});const data=await r.json();
 if(r.ok){result=data;break;}console.log(`Evaluator retry ${attempt+1}: ${data.error}`);await new Promise(resolve=>setTimeout(resolve,2000));
 }if(!result)throw new Error('Evaluator unavailable; completed verdicts are cached.');
 batch.forEach(c=>{const verdict=result.calls.find(v=>v.id===c.key);if(!verdict)throw new Error(`Missing verdict ${c.key}`);cache[signature(c)]=verdict;});writeFileSync(path,JSON.stringify(cache,null,2));done+=batch.length;
 const output=Object.fromEntries(calls.filter(c=>cache[signature(c)]).map(c=>[c.key,{...cache[signature(c)],id:c.key}]));writeFileSync('shared/evaluations.mjs.tmp',`// Actual OpenRouter LLM verdicts, prepared once and replayed without API calls.\nexport const evaluations = ${JSON.stringify(output,null,2)};\n`);renameSync('shared/evaluations.mjs.tmp','shared/evaluations.mjs');console.log(`LLM tagged ${Object.keys(output).length}/${calls.length} recordings`);
}
console.log('Every prepared call has a cached LLM disposition and evidence.');
