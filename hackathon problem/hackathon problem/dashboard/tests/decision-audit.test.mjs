import test from 'node:test';
import assert from 'node:assert/strict';
import {batchPlan,decide,aggregate,defaultGoals,fixture} from '../shared/domain.mjs';
import {checkpointCalls,goalComparison,experimentRounds} from '../shared/decision-audit.mjs';
function run(){
 const exp={calls:[],decisions:[],initial:20,allocation:20,goal:defaultGoals};
 for(let round=0;round<4;round++){
  exp.calls.push(...batchPlan(round,exp.allocation,'growth',8));
  const d={...decide(exp.calls,exp.allocation,100,true,exp.goal,round===3),from:exp.allocation,calls:exp.calls.length,round};
  exp.decisions.push(d);exp.allocation=d.allocation;
 }return exp;
}
test('checkpoint evidence excludes later calls and its A/B counts match actual assignments',()=>{
 const exp=run();
 for(let i=0;i<4;i++){
  const snapshot=checkpointCalls(exp.calls,exp.decisions,i),d=exp.decisions[i];
  assert.equal(snapshot.length,d.calls);assert.equal(snapshot.filter(c=>c.variant==='A').length,d.aCount);assert.equal(snapshot.filter(c=>c.variant==='B').length,d.bCount);
  const rows=goalComparison(snapshot,exp.goal),combined=rows.at(-1);
  assert.ok(Math.abs(combined.A.rate-d.aRate)<1e-10);assert.ok(Math.abs(combined.B.rate-d.bRate)<1e-10);
  assert.deepEqual(rows,goalComparison(checkpointCalls(exp.calls.slice(0,d.calls),exp.decisions,i),exp.goal));
 }
 assert.equal(checkpointCalls(exp.calls,exp.decisions,0).length,15);
});
test('rounds partition every call exactly once and explain the 19 B calls',()=>{
 const exp=run(),rounds=experimentRounds(exp);
 assert.deepEqual(rounds.flatMap(r=>r.calls),exp.calls);
 assert.equal(new Set(rounds.flatMap(r=>r.calls.map(c=>c.personaId))).size,50);
 assert.deepEqual(rounds.map(r=>r.calls.filter(c=>c.variant==='B').length),[3,6,4,6]);
 assert.equal(rounds.reduce((n,r)=>n+r.calls.filter(c=>c.variant==='B').length,0),19);
 assert.deepEqual(rounds.map(r=>r.allocation),[20,40,50,50]);
 for(let i=0;i<4;i++)assert.deepEqual(checkpointCalls(exp.calls,exp.decisions,i,'round'),rounds[i].calls);
});
test('winner evidence shows the independent 10 A / 10 B calls, distinct from all 50',()=>{
 const exp=run(),confirmation=checkpointCalls(exp.calls,exp.decisions,3,'confirmation'),all=checkpointCalls(exp.calls,exp.decisions,3);
 assert.equal(confirmation.length,20);assert.ok(confirmation.every(c=>c.phase==='confirmation'));
 assert.equal(aggregate(confirmation,'A',exp.goal).goals,1);assert.equal(aggregate(confirmation,'B',exp.goal).goals,7);
 assert.equal(aggregate(confirmation,'A',exp.goal).count,10);assert.equal(aggregate(confirmation,'B',exp.goal).count,10);
 assert.equal(all.length,50);assert.equal(checkpointCalls(exp.calls,exp.decisions,2,'confirmation').length,10);
});
test('empty and partial runs have honest denominators and selected columns only',()=>{
 assert.equal(goalComparison([],defaultGoals)[0].A.rate,null);
 const c={...fixture('p01','B'),guardrails:['Unsafe promise']},rows=goalComparison([c],['capture_quantity']);
 assert.deepEqual(rows.map(r=>r.id),['capture_quantity','all']);assert.equal(rows[0].B.rate,0);assert.equal(rows[0].B.total,1);
 const exp=run(),partial={...exp,decisions:exp.decisions.slice(0,1),calls:exp.calls.slice(0,18),allocation:40};
 const rounds=experimentRounds(partial);assert.equal(rounds.length,2);assert.equal(rounds[1].calls.length,3);assert.equal(rounds[1].decision,null);assert.equal(rounds[1].start,15);
 const stopped={...exp,decisions:[{...exp.decisions[0],calls:9}],calls:exp.calls.slice(0,9)};
 assert.equal(experimentRounds(stopped).flatMap(r=>r.calls).length,9);
});
