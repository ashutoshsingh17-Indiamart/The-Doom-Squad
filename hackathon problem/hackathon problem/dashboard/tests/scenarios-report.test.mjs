import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../shared/domain.mjs';
import {demoScenarios,nextDemoScenario,selectDemoScenario} from '../shared/demo-scenarios.mjs';
import {preparedExperiment,completeExperiment} from '../shared/experiment-run.mjs';
import {experimentPDF} from '../shared/report-pdf.mjs';

const expected={growth:[40,50,50,100],'late-safety':[40,0],fade:[40,20,20,20],recovery:[20,40,40,40],hold:[20,20,20,20],reverse:[10,5,5,0]};
test('six prepared paths exercise growth, retreat, recovery, steady exposure and independent A/B winners',()=>{
 for(const profile of demoScenarios){
  const run=completeExperiment(preparedExperiment(profile.id));
  assert.deepEqual(run.decisions.map(d=>d.allocation),expected[profile.id],profile.id);
  assert.equal(run.status,'completed');assert.equal(new Set(run.calls.map(c=>c.personaId)).size,run.calls.length);
  if(profile.id==='late-safety'){assert.equal(run.calls.length,19);assert.ok(run.calls.at(-1).guardrails.length);assert.equal(run.decisions.at(-1).action,'rollback');}
  else{assert.equal(run.calls.length,50);assert.equal(run.calls.filter(c=>c.phase==='confirmation'&&c.variant==='A').length,10);assert.equal(run.calls.filter(c=>c.phase==='confirmation'&&c.variant==='B').length,10);}
 }
 assert.equal(completeExperiment(preparedExperiment('reverse')).decisions.at(-1).title,'Baseline A wins');
 assert.equal(completeExperiment(preparedExperiment('growth')).decisions.at(-1).action,'winner');
});
test('scenario variety never changes the transcript, audio, duration or verdict for a recording key',()=>{
 for(const profile of demoScenarios)for(const call of completeExperiment(preparedExperiment(profile.id)).calls){
  const type=call.key.split('-').at(-1),original=fixture(call.personaId,type==='R'?'B':type,type==='R'?'regression':'growth');
  for(const key of ['key','audio','duration','turns','extracted','evaluation','disposition','guardrails'])assert.deepEqual(call[key],original[key],`${profile.id}: ${call.key}: ${key}`);
  assert.equal(call.id,`${call.personaId}-${call.variant}`);assert.ok(call.audioReady);assert.ok(call.evaluation);
 }
});
test('controls still change prepared outcomes rather than scripts forcing a winner',()=>{
 const review=completeExperiment(preparedExperiment('growth',{automatic:false}));assert.notEqual(review.allocation,100);
 const strong=preparedExperiment('growth');strong.rollout.evidence='strong';assert.notEqual(completeExperiment(strong).decisions.at(-1).action,'winner');
 const off=preparedExperiment('fade');off.rollout.reduceOnDrop=false;assert.equal(completeExperiment(off).decisions[1].allocation,40);
});
test('new experiments cycle through every path without consuming the choice on page load',()=>{
 const original=globalThis.localStorage,data=new Map();globalThis.localStorage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)};
 try{assert.deepEqual(Array.from({length:7},()=>nextDemoScenario().id),[...demoScenarios.map(s=>s.id),'growth']);}finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;}
});
test('legacy seed or scenario URLs rotate; only explicit pin=1 requests a repeated replay',()=>{
 const original=globalThis.localStorage,data=new Map();globalThis.localStorage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
 try{
  assert.equal(selectDemoScenario('?seed=8&scenario=growth').id,'growth');
  assert.equal(selectDemoScenario('?seed=8&scenario=growth').id,'late-safety');
  assert.equal(selectDemoScenario('?seed=8').id,'fade');
  for(let i=0;i<2;i++)assert.equal(selectDemoScenario('?pin=1&scenario=reverse').id,'reverse');
  assert.equal(selectDemoScenario('').id,'recovery');
  assert.equal(selectDemoScenario('?pin=1&scenario=fade').seed,10);
  assert.equal(selectDemoScenario('?pin=1&scenario=fade&seed=22').seed,22);
 }finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;}
});
test('blocked storage still cycles in memory, and corrupt stored indices recover safely',()=>{
 const original=globalThis.localStorage;
 try{
  globalThis.localStorage={getItem:()=>{throw new Error('Blocked');},setItem:()=>{throw new Error('Blocked');}};
  const ids=Array.from({length:7},()=>nextDemoScenario().id);assert.equal(new Set(ids.slice(0,6)).size,6);assert.equal(ids[0],ids[6]);
  for(const value of ['-1','0.5','NaN']){globalThis.localStorage={getItem:()=>value,setItem:()=>{}};assert.equal(nextDemoScenario().id,'growth');}
 }finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;}
});
test('PDF contains both evidence scopes, the whole numbered audit and valid object offsets',()=>{
 const exp=completeExperiment(preparedExperiment('growth')),bytes=experimentPDF(exp),doc=Buffer.from(bytes).toString('ascii');
 assert.ok(doc.startsWith('%PDF-1.4'));assert.ok(doc.endsWith('%%EOF\n'));assert.ok(doc.includes('(This stage only)'));assert.ok(doc.includes('(Cumulative / calls so far)'));assert.ok(doc.includes('(A  31 calls)'));assert.ok(doc.includes('(B  19 calls)'));assert.ok(doc.includes('Fisher exact p = 0.0198'));
 for(const c of exp.calls)assert.ok(doc.includes(`(${c.persona.name})`));
 const start=Number(doc.match(/startxref\n(\d+)/)[1]);assert.equal(doc.slice(start,start+4),'xref');
 const offsets=[...doc.matchAll(/^(\d{10}) 00000 n /gm)].map(m=>Number(m[1]));offsets.forEach((o,i)=>assert.ok(doc.slice(o).startsWith(`${i+1} 0 obj`)));
 const pages=Number(doc.match(/\/Type \/Pages.*\/Count (\d+)/)[1]);assert.ok(pages>=12);
});
