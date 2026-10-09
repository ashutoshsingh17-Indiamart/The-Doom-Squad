import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,statSync} from 'node:fs';
import {fixture,aggregate,decide,batchPlan,personas,products,fisherExact,significance,shuffledCohort} from '../shared/domain.mjs';
const call=(variant,win,phase='confirmation')=>({...fixture('p01',variant),phase,disposition:win?'Buyer enriched':'Partial requirement',success:win,capture:win?100:33,guardrails:[]});
test('50 unique buyers cover six products, both genders and realistic contact failures',()=>{
 assert.equal(personas.length,50);assert.equal(new Set(personas.map(p=>p.id)).size,50);assert.equal(products.length,6);assert.equal(new Set(personas.map(p=>p.productId)).size,6);
 for(const kind of ['no_answer','complaint','wrong_number','purchased','partial','busy'])assert.ok(personas.some(p=>p.kind===kind));
 for(const p of personas){assert.notEqual(p.voice,p.agentVoice);assert.ok((p.gender==='female'?['ishita','priya','pooja']:['ratan','rahul','amit']).includes(p.voice));}
});
test('all assigned calls count in goal and capture denominators, including no answer',()=>{
 const noAnswer={...call('B',false),answered:false,capture:0,disposition:'No answer'},stats=aggregate([call('B',true),noAnswer],'B');
 assert.equal(stats.count,2);assert.equal(stats.goals,1);assert.equal(stats.recovery,50);assert.equal(stats.capture,50);assert.equal(stats.dispositions['No answer'],1);
});
test('callback goal is separate from a complete buyer requirement',()=>{
 const callback={...call('B',false),disposition:'Callback fixed',capture:0};
 assert.equal(aggregate([callback],'B','Callback fixed').goals,1);assert.equal(aggregate([callback],'B','Buyer enriched').goals,0);
});
test('randomized batches assign each buyer once and freeze the confirmation split at launch',()=>{
 const ids=[],runs=[];for(let i=0;i<4;i++){const batch=batchPlan(i,i<2?20:0,'growth',42);runs.push(...batch);ids.push(...batch.map(c=>c.personaId));}
 assert.equal(ids.length,50);assert.equal(new Set(ids).size,50);assert.deepEqual(shuffledCohort(42),shuffledCohort(42));assert.notDeepEqual(shuffledCohort(42),shuffledCohort(43));
 const confirmation=runs.filter(c=>c.phase==='confirmation');assert.equal(confirmation.filter(c=>c.variant==='A').length,10);assert.equal(confirmation.filter(c=>c.variant==='B').length,10);
 assert.deepEqual(batchPlan(2,20,'growth',42).map(c=>c.id),batchPlan(2,70,'growth',42).map(c=>c.id));
});
test('Fisher exact calculation matches a known two-sided 2x2 example',()=>{
 assert.ok(Math.abs(fisherExact(1,10,11,14)-.00275945618522)<1e-10);assert.equal(fisherExact(0,0,3,10),1);assert.ok(Math.abs(fisherExact(5,10,5,10)-1)<1e-10);
});
test('pilot performance is excluded from the significance and final winner check',()=>{
 const pilot=Array.from({length:30},(_,i)=>call(i%2?'A':'B',!(i%2),'pilot'));
 const equal=Array.from({length:20},(_,i)=>call(i<10?'A':'B',i%2===0));const evidence=significance([...pilot,...equal]);assert.equal(evidence.p,1);assert.equal(evidence.aCount,10);assert.equal(evidence.bCount,10);
 assert.equal(decide([...pilot,...equal],50,100,true,'Buyer enriched',true).action,'hold');
});
test('final winner requires significance and sample size; promotion respects the limit',()=>{
 const strong=Array.from({length:20},(_,i)=>call(i<10?'A':'B',i>=10));
 assert.equal(decide(strong,50,100,true,'Buyer enriched',true).allocation,100);assert.equal(decide(strong,50,70,true,'Buyer enriched',true).allocation,70);
 assert.equal(decide(strong,50,100,false,'Buyer enriched',true).allocation,50);
 const tiny=[call('A',false),call('B',true)];assert.equal(decide(tiny,5,100,true,'Buyer enriched',true).action,'hold');
});
test('critical safety failures stop B immediately, including manual rollout mode',()=>{
 const violation={...call('B',true,'pilot'),guardrails:['Unsupported price guarantee'],disposition:'Guardrail failure'};
 const result=decide([violation],20,100,false);assert.equal(result.action,'rollback');assert.equal(result.allocation,0);
});
test('pilot expansion is provisional and worse quality lowers exposure',()=>{
 const positive=[...Array.from({length:6},()=>call('A',false,'pilot')),...Array.from({length:3},()=>call('B',true,'pilot'))];assert.equal(decide(positive,20).allocation,40);
 const worse=[...Array.from({length:6},(_,i)=>call('A',i<4,'pilot')),...Array.from({length:3},()=>call('B',false,'pilot'))];assert.equal(decide(worse,40).allocation,20);
});
test('every prepared recording has audio and an actual LLM verdict with exact buyer evidence',()=>{
 for(const p of personas)for(const [variant,scenario]of [['A','growth'],['B','growth'],['B','regression']]){
 const c=fixture(p.id,variant,scenario);assert.ok(c.audioReady,c.key);assert.ok(existsSync(`public${c.audio}`),c.key);assert.ok(statSync(`public${c.audio}`).size>1000);assert.ok(c.duration>0);assert.ok(c.evaluation,c.key);
 const buyer=c.turns.filter(t=>t.speaker==='buyer').map(t=>t.text).join('\n');for(const quote of Object.values(c.evaluation.evidence||{}))assert.ok(buyer.includes(quote),`${c.key}: ${quote}`);
 }
});
