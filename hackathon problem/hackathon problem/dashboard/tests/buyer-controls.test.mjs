import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,aggregate,decide,defaultGoals,defaultRollout,callMeetsGoal,personas,batchPlan} from '../shared/domain.mjs';
import {promptPresets,preparedPrompt} from '../shared/prompt-presets.mjs';
const partial={...fixture('p01','B'),disposition:'Partial requirement',extracted:{Quantity:'200'},capture:33,guardrails:[]};
test('goal selectors evaluate different buyer facts and require every selected goal',()=>{
 assert.equal(callMeetsGoal(partial,'confirm_need'),true);assert.equal(callMeetsGoal(partial,'capture_quantity'),true);assert.equal(callMeetsGoal(partial,'capture_specs'),false);
 assert.equal(aggregate([partial],'B',['capture_quantity']).goals,1);assert.equal(aggregate([partial],'B',defaultGoals).goals,0);
 assert.equal(aggregate([partial],'B',[]).goals,0);assert.equal(aggregate([partial],'B',['unknown']).goals,0);
 const rejected={...partial,disposition:'Complaint'};assert.equal(aggregate([rejected],'B',['capture_quantity']).goals,0);
 const unsafe={...partial,guardrails:['Unsupported promise']};assert.equal(aggregate([unsafe],'B',['confirm_need']).goals,0);
});
test('all three buyer goals require the quantity and both specifications in the evaluated fields',()=>{
 for(const persona of personas)for(const variant of ['A','B']){const c=fixture(persona.id,variant);const hasFields=!!c.extracted.Quantity&&c.product.specs.every(s=>!!c.extracted[s.key]);const confirmed=['Buyer enriched','Partial requirement','Callback fixed'].includes(c.disposition);assert.equal(aggregate([c],variant,defaultGoals).goals,hasFields&&confirmed&&!c.guardrails.length?1:0,c.key);}
});
test('selecting only intent produces a different result than selecting all collection goals',()=>{
 const confirm=[...batchPlan(2,50,'growth',8),...batchPlan(3,50,'growth',8)];
 assert.equal(decide(confirm,50,100,true,defaultGoals,true).allocation,100);
 assert.notEqual(aggregate(confirm,'A',['confirm_need']).goals,aggregate(confirm,'A',defaultGoals).goals);
});
test('growth toggle, increment, and maximum change actual traffic decisions',()=>{
 const positive=[...Array.from({length:6},()=>({...partial,variant:'A'})),...Array.from({length:3},()=>({...fixture('p01','B'),variant:'B'}))];
 assert.equal(decide(positive,20,100,true,defaultGoals,false,{rampStep:10}).allocation,30);
 assert.equal(decide(positive,20,100,true,defaultGoals,false,{rampStep:25}).allocation,45);
 assert.equal(decide(positive,20,100,true,defaultGoals,false,{rampUp:false}).allocation,20);
 assert.equal(decide(positive,45,50,true,defaultGoals,false,{rampStep:25}).allocation,50);
});
test('reduction and quality toggles affect decisions; unsafe promises still stop B',()=>{
 const worse=[...Array.from({length:6},(_,i)=>i<4?{...fixture('p01','A'),variant:'A'}:{...partial,variant:'A'}),...Array.from({length:3},()=>partial)];
 assert.equal(decide(worse,40,100,true,defaultGoals,false).allocation,20);
 assert.equal(decide(worse,40,100,true,defaultGoals,false,{reduceOnDrop:false}).allocation,40);
 const unsafe={...partial,guardrails:['Unsupported price guarantee']};assert.equal(decide([unsafe],40,100,false,defaultGoals,false,{reduceOnDrop:false}).allocation,0);
 // Quantity can improve while other detail collection falls. Quality protection is independent.
 const a=[...Array.from({length:6},()=>({...partial,variant:'A',extracted:{Fabric:'Cotton',Pattern:'Plain'},capture:67}))];
 const b=Array.from({length:3},()=>partial);
 assert.equal(decide([...a,...b],20,100,true,['capture_quantity'],false,{protectCapture:true}).allocation,10);
 assert.equal(decide([...a,...b],20,100,true,['capture_quantity'],false,{protectCapture:false}).allocation,40);
});
test('stronger evidence changes the final winner threshold',()=>{
 const calls=[...batchPlan(2,50,'growth',8),...batchPlan(3,50,'growth',8)];
 assert.equal(decide(calls,50,100,true,defaultGoals,true,defaultRollout).action,'winner');
 assert.equal(decide(calls,50,100,true,defaultGoals,true,{evidence:'strong'}).action,'hold');
});
test('every suggestion is a distinct prepared prompt that preserves the current control',()=>{
 assert.equal(promptPresets.length,4);const baseline='Current identity and buyer collection rules.';
 const outputs=promptPresets.map(p=>preparedPrompt(p.id,baseline));assert.equal(new Set(outputs.map(p=>p.prompt)).size,4);
 for(const output of outputs){assert.ok(output.prompt.startsWith(baseline));assert.ok(output.changes.length>0);assert.ok(output.hypothesis);}
});
