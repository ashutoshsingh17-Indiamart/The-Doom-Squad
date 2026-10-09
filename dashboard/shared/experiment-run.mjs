import {batchPlan,decide,baselinePrompt,defaultGoals,defaultRollout} from './domain.mjs';
import {demoScenarios,scenarioPolicy} from './demo-scenarios.mjs';
import {preparedPrompt} from './prompt-presets.mjs';

// The UI, reproducible samples and policy tests share the same state transition.
export function advanceExperiment(e){
 if(e.status!=='running')return e;
 if(e.progress<100)return {...e,progress:e.progress+25};
 const calls=[...e.calls,e.queue[e.cursor]];
 if(!calls.at(-1)?.guardrails.length&&e.cursor+1<e.queue.length)return {...e,calls,cursor:e.cursor+1,progress:0};
 const decision={...decide(calls,e.allocation,e.maximum,e.automatic,e.goal,e.round===3,{...e.rollout,...scenarioPolicy(e.scenario)}),from:e.allocation,elapsedMinutes:Math.round(calls.length/50*e.windowHours*60),round:e.round,calls:calls.length,at:new Date().toISOString()};
 const round=e.round+1,finished=round>3||decision.action==='rollback';
 return {...e,calls,decisions:[...e.decisions,decision],allocation:decision.allocation,round,status:finished?'completed':'running',queue:finished?[]:batchPlan(round,decision.allocation,e.scenario,e.seed),cursor:0,progress:0};
}
export function completeExperiment(e){
 let next={...e,status:'running'};
 for(let i=0;i<300&&next.status==='running';i++)next=advanceExperiment(next);
 if(next.status==='running')throw new Error('Replay did not finish within the declared call budget');
 return next;
}
export function preparedExperiment(scenario='growth',settings={}){
 const profile=demoScenarios.find(s=>s.id===scenario)||demoScenarios[0],initial=settings.initial??20,seed=settings.seed??profile.seed,startedAt=settings.startedAt||new Date().toISOString(),preset=preparedPrompt('specs',baselinePrompt);
 return {id:settings.id||globalThis.crypto.randomUUID(),name:`Requirement collection / ${profile.name}`,scenario:profile.id,status:'running',calls:[],decisions:[],allocation:initial,initial,maximum:100,automatic:true,round:0,queue:batchPlan(0,initial,profile.id,seed),cursor:0,progress:0,promptA:baselinePrompt,promptB:preset.prompt,improvement:preset.request,source:'Saved suggestion',goal:[...defaultGoals],rollout:{...defaultRollout},windowHours:4,seed,startedAt,endsAt:new Date(Date.parse(startedAt)+4*3600000).toISOString(),...settings};
}
