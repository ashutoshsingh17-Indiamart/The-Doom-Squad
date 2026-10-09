import {buyerGoals,callMeetsGoal,callMeetsGoals} from './buyer-goals.mjs';

// Always slice at the decision boundary: later calls must never change its evidence.
export function checkpointCalls(calls,decisions,index,scope='all'){
 const end=Math.min(decisions[index]?.calls??calls.length,calls.length);
 const start=scope==='round'?(decisions[index-1]?.calls??0):0;
 const snapshot=calls.slice(start,end);
 return scope==='confirmation'?snapshot.filter(c=>c.phase==='confirmation'):snapshot;
}
export function goalComparison(calls,selection){
 const goals=Array.isArray(selection)?buyerGoals.filter(g=>selection.includes(g.id)):[];
 const row=(id,label,test)=>({id,label,...Object.fromEntries(['A','B'].map(variant=>{
  const assigned=calls.filter(c=>c.variant===variant),met=assigned.filter(test).length;
  return [variant,{met,total:assigned.length,rate:assigned.length?met/assigned.length*100:null}];
 }))});
 return [...goals.map(g=>row(g.id,g.name,c=>callMeetsGoal(c,g.id))),row('all',goals.length?'All selected goals':String(selection),c=>callMeetsGoals(c,selection))];
}
export function experimentRounds(exp){
 let start=0;
 const rounds=exp.decisions.map((decision,index)=>{
  const end=Math.min(decision.calls,exp.calls.length),calls=exp.calls.slice(start,end);
  const round={index,start,end,calls,allocation:decision.from??(index?exp.decisions[index-1].allocation:exp.initial),decision};
  start=end;return round;
 });
 if(start<exp.calls.length)rounds.push({index:rounds.length,start,end:exp.calls.length,calls:exp.calls.slice(start),allocation:exp.allocation,decision:null});
 return rounds;
}
