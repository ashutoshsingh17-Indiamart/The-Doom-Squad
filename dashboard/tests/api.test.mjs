import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import {demoScenarios} from '../shared/demo-scenarios.mjs';
import {preparedExperiment,completeExperiment} from '../shared/experiment-run.mjs';
test('cross-origin POST requests cannot invoke provider APIs',async()=>{
  const response=await worker.fetch(new Request('http://127.0.0.1:3000/api/prompts/generate',{method:'POST',headers:{origin:'https://external.example','content-type':'application/json'},body:'{}'}),{});
  assert.equal(response.status,403);
});
test('malformed requests fail before calling any provider',async()=>{
  const malformed=await worker.fetch(new Request('http://127.0.0.1:3000/api/live/start',{method:'POST',body:'not-json'}),{});assert.equal(malformed.status,400);
  const unsupported=await worker.fetch(new Request('http://127.0.0.1:3000/api/live/start',{method:'POST',body:JSON.stringify({productId:'unknown'})}),{});assert.equal(unsupported.status,400);
});
test('text-mode opening uses known buyer context without speech or model requests',async()=>{
  const response=await worker.fetch(new Request('http://127.0.0.1:3000/api/live/start',{method:'POST',body:JSON.stringify({productId:'chairs',voice:false,buyerName:'Demo Buyer',buyerCity:'Delhi'})}),{});
  assert.equal(response.status,200);const data=await response.json();assert.equal(data.audio,null);assert.equal(data.state.fields.Name,'Demo Buyer');assert.equal(data.state.fields.City,'Delhi');assert.match(data.reply,/office chairs/);
});
test('experiment save rejects invalid identifiers without hitting Supabase',async()=>{
  const response=await worker.fetch(new Request('http://127.0.0.1:3000/api/experiments/save',{method:'POST',body:JSON.stringify({id:'bad',name:'Demo',scenario:'growth',status:'running'})}),{});assert.equal(response.status,400);
});
test('every rotating outcome is accepted and persisted intact by the save API',async()=>{
 const original=globalThis.fetch;let writes=0;
 globalThis.fetch=async(url,options)=>{assert.match(url,/\/rest\/v1\/voiceops_experiments\?on_conflict=id$/);assert.equal(options.method,'POST');writes++;return new Response(options.body,{headers:{'content-type':'application/json'}});};
 try{
  for(const profile of demoScenarios){
   const run=completeExperiment(preparedExperiment(profile.id)),body={id:run.id,name:run.name,status:run.status,scenario:run.scenario,payload:run};
   const response=await worker.fetch(new Request('http://127.0.0.1:3000/api/experiments/save',{method:'POST',body:JSON.stringify(body)}),{SUPABASE_URL:'https://example.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test'});
   assert.equal(response.status,200,profile.id);assert.deepEqual((await response.json()).payload,run);
  }
  assert.equal(writes,6);
  const invalid=await worker.fetch(new Request('http://127.0.0.1:3000/api/experiments/save',{method:'POST',body:JSON.stringify({id:crypto.randomUUID(),name:'Unknown',scenario:'unknown',status:'completed',payload:{}})}),{});assert.equal(invalid.status,400);assert.equal(writes,6);
 }finally{globalThis.fetch=original;}
});
