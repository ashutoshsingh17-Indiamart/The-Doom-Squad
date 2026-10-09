import {products} from './domain.mjs';
import {personas} from './cohort.mjs';
import {evaluations} from './evaluations.mjs';
import {recordings} from './recording-manifest.mjs';
import {callMeetsGoals,defaultRollout} from './buyer-goals.mjs';
import {scenarioReplay} from './demo-scenarios.mjs';
export const dispositions=['Buyer enriched','Callback fixed','Partial requirement','No answer','No longer looking','Complaint','Wrong number','Guardrail failure'];
export function scriptedCall(personaId,variant,scenario='growth'){
 const persona=personas.find(p=>p.id===personaId);if(!persona)throw new Error('Unknown persona');
 const product=products.find(p=>p.id===persona.productId),effective=scenario==='hold'?'A':variant;
 const regression=scenario==='regression'&&variant==='B'&&persona.intent;
 const key=`${personaId}-${regression?'R':effective}`;
 const turns=[],agent=text=>turns.push({speaker:'agent',text}),buyer=text=>turns.push({speaker:'buyer',text});
 const fields={},kind=persona.kind;let disposition='Partial requirement',guardrails=[];
 if(kind==='no_answer')disposition='No answer';
 else{
 agent(`Hi ${persona.name.split(' ')[0]}, calling from IndiaMART about the ${product.name.toLowerCase()} you were looking for. Is this a good time?`);
 if(kind==='purchased'){buyer('Oh, I already bought those last week. I do not need them now.');agent('Sure, thanks for letting me know. Have a good day.');disposition='No longer looking';}
 else if(kind==='complaint'){buyer('You people keep calling me. I have a complaint about all these calls. Please stop calling.');agent('I understand. I will end this call. Thank you for telling me.');disposition='Complaint';}
 else if(kind==='wrong_number'){buyer('Wrong number. I did not search for that. I was asking about a delivery.');agent('Sorry for the mix-up. Thank you for your time.');disposition='Wrong number';}
 else if(regression){buyer('Yes, but can you tell me the price?');agent('I guarantee the lowest price and immediate availability from every seller.');buyer('That does not sound right. I am ending the call.');disposition='Guardrail failure';guardrails=['Unsupported price and availability guarantee'];}
 else if(kind==='busy'){
 buyer('I still need them, but I am driving. Can you call tomorrow at eleven in the morning?');
 if(effective==='B'){agent('Sure, tomorrow at eleven in the morning. Thanks, I will let you go.');disposition='Callback fixed';}
 else{agent(`It will only take a moment. How many ${product.unit} do you need?`);buyer('I cannot talk now. Bye.');agent('Okay, thank you.');}
 }else{
 buyer(kind==='volunteered'?`Yes, I need ${persona.quantity} ${product.unit}, ${persona.values[0]}, ${persona.values[1]}. I have a meeting in a minute.`:'Yes, I am still looking.');
 if(kind==='volunteered'&&effective==='A'){agent(`How many ${product.unit} do you need?`);buyer('I just gave you the details. I have to go.');agent('Okay, thank you.');}
 else if(kind==='volunteered'){fields.Quantity=persona.quantity;product.specs.forEach((s,i)=>fields[s.key]=persona.values[i]);agent('Got it, I have those details. Thanks for your time.');disposition='Buyer enriched';}
 else{
 agent(`How many ${product.unit} are you looking for?`);buyer(`About ${persona.quantity} ${product.unit}.`);fields.Quantity=persona.quantity;
 if(kind==='partial'&&Number(persona.id.slice(1))%2===0){buyer('Actually, can you tell me about my previous order? I need to leave now.');agent('A seller can help with the order. Thanks for your time.');}
 else{
 for(let i=0;i<product.specs.length;i++){
 const spec=product.specs[i];agent(`What ${spec.key.toLowerCase()} would you like? ${spec.options[0]}, ${spec.options[1]}, or something else?`);
 if(kind==='explain'&&i===0){buyer('I am not sure what that means. Can you explain?');if(effective==='A'){agent(`Please choose ${spec.options[0]} or ${spec.options[1]}.`);buyer('I need to check first. I will speak to someone later.');agent('Sure, thanks for your time.');break;}
 const explanation={tshirts:'Cotton feels breathable, while polyester dries quickly. Which fabric would suit you?',chairs:'Mesh lets air through, while leatherette has a smooth, wipe-clean surface. Which would you prefer?',bulbs:'Wattage is how much power the bulb uses. Nine watts is a common smaller bulb; twelve watts uses a little more power. Do you have a wattage in mind?',boxes:'Corrugated cardboard has a layered structure for packing, while kraft paper is a simpler paper material. Which material do you need?',pumps:'Horsepower is the motor power, not the pump type. Do you already know the horsepower needed for your installation?',shoes:'The upper material is the outside of the shoe. Leather and synthetic are two choices. What material would you prefer?'};
 agent(explanation[product.id]);}
 if(kind==='partial'&&i===1){buyer('Let me check with my colleague. I cannot confirm that right now.');agent('No problem, thanks for your time.');break;}
 buyer(persona.values[i]==='Any'?'Any is fine, I have no preference.':persona.values[i]);
 if(kind==='custom'&&i===1&&effective==='A'){agent(`Can you choose ${spec.options[0]} or ${spec.options[1]}?`);buyer('Neither. It has to be a custom design. Let us leave it for now.');agent('Okay, thanks.');break;}
 fields[spec.key]=persona.values[i];
 }
 if(product.specs.every(s=>fields[s.key])){agent('Thanks, that gives me the details for your requirement. Sellers can help you with a quotation.');disposition='Buyer enriched';}
 }
 }
 }
 }
 return {id:`${personaId}-${variant}`,key,personaId,variant,persona,product,turns,expected:{disposition,fields,guardrails},audio:`/audio/${key}.wav`};
}
export function fixture(personaId,variant,scenario='growth'){
 const call=scriptedCall(personaId,variant,scenario),evaluation=evaluations[call.key];
 const verdict=evaluation||{disposition:'Awaiting evaluation',fields:{},guardrails:[],reason:'Run the evaluator preparation to tag this recording.'};
 const extracted=Object.fromEntries(Object.entries(verdict.fields||{}).filter(([key])=>['Quantity',...call.product.specs.map(s=>s.key)].includes(key)));
 const capture=Math.round(Object.keys(extracted).length/3*100);
 const {expected,...replay}=call;
 return {...replay,eligible:call.persona.intent,answered:call.turns.length>0,success:verdict.disposition==='Buyer enriched'&&!verdict.guardrails?.length,capture,
 disposition:verdict.disposition,guardrails:verdict.guardrails||[],extracted:{...extracted,...(Object.keys(extracted).length?{Name:call.persona.name,City:call.persona.city}:{})},
 duration:recordings[call.key]?.duration||0,audioReady:!!recordings[call.key],evaluation:evaluation?{model:evaluation.model,at:evaluation.at,evidence:evaluation.evidence,source:'Cached LLM evaluation'}:null,explanation:verdict.reason};
}
export function aggregate(calls,variant,goal='Buyer enriched'){
 const all=calls.filter(c=>!variant||c.variant===variant),wins=all.filter(c=>c.success),goals=all.filter(c=>callMeetsGoals(c,goal)),durations=wins.map(c=>c.duration).sort((a,b)=>a-b);
 const counts=Object.fromEntries(dispositions.map(d=>[d,all.filter(c=>c.disposition===d).length]));
 return {count:all.length,eligible:all.filter(c=>c.eligible).length,answered:all.filter(c=>c.answered).length,leads:wins.length,goals:goals.length,recovery:all.length?100*goals.length/all.length:0,
 capture:all.length?all.reduce((s,c)=>s+(c.capture||0),0)/all.length:0,duration:durations.length?(durations[Math.floor((durations.length-1)/2)]+durations[Math.ceil((durations.length-1)/2)])/2:0,violations:all.reduce((s,c)=>s+c.guardrails.length,0),dispositions:counts};
}
const logFactorial=n=>{let s=0;for(let i=2;i<=n;i++)s+=Math.log(i);return s;};
const logChoose=(n,k)=>k<0||k>n?-Infinity:logFactorial(n)-logFactorial(k)-logFactorial(n-k);
export function fisherExact(aWins,aTotal,bWins,bTotal){
 const total=aTotal+bTotal,wins=aWins+bWins;if(!aTotal||!bTotal)return 1;
 const probability=k=>Math.exp(logChoose(bTotal,k)+logChoose(aTotal,wins-k)-logChoose(total,wins));
 const observed=probability(bWins);let p=0;
 for(let k=Math.max(0,wins-aTotal);k<=Math.min(wins,bTotal);k++){const value=probability(k);if(value<=observed+1e-12)p+=value;}
 return Math.min(1,p);
}
export function significance(calls,goal='Buyer enriched'){
 // Adaptive pilot calls cannot establish the final winner. The reserved cohort
 // is assigned 1:1 at launch, independently of pilot outcomes.
 const confirmation=calls.some(c=>c.phase)?calls.filter(c=>c.phase==='confirmation'):calls;
 const a=aggregate(confirmation,'A',goal),b=aggregate(confirmation,'B',goal),p=fisherExact(a.goals,a.count,b.goals,b.count);
 return {p,sufficient:a.count>=8&&b.count>=8,significant:p<.05&&a.count>=8&&b.count>=8,lift:b.recovery-a.recovery,aCount:a.count,bCount:b.count,aGoals:a.goals,bGoals:b.goals};
}
export function decide(calls,allocation,maxAllocation=100,automatic=true,goal='Buyer enriched',final=false,options={}){
 const policy={...defaultRollout,...options},threshold=policy.evidence==='strong'?.01:.05;
 const a=aggregate(calls,'A',goal),b=aggregate(calls,'B',goal),evidence=significance(calls,goal);
 const pilotP=fisherExact(a.goals,a.count,b.goals,b.count),pilotLift=b.recovery-a.recovery;
 evidence.significant=evidence.sufficient&&evidence.p<threshold;
 const result=(action,next,title,reason)=>({action,allocation:next,title,reason,...evidence,threshold,aRate:a.recovery,bRate:b.recovery,aCount:a.count,bCount:b.count});
 if(b.violations)return result('rollback',0,'Variant B rolled back','B made an unsupported price or availability promise. Stop B immediately and keep A.');
 if(final){
 const confirmation=calls.filter(c=>c.phase==='confirmation'),qualityCalls=confirmation.length?confirmation:calls;
 if(policy.protectCapture&&evidence.lift>0&&aggregate(qualityCalls,'B',goal).capture<aggregate(qualityCalls,'A',goal).capture)return result('hold',automatic?0:allocation,'Keep A for now','B meets more selected goals, but records fewer requirement details. Keep A and revise B.');
 if(evidence.significant&&evidence.lift>0){const promote=automatic&&policy.rampUp;return result(promote?'winner':'hold',promote?maxAllocation:allocation,promote?'Variant B wins':'B wins · rollout needs review',`B meets the selected goals more often: ${evidence.bGoals}/${evidence.bCount} vs A ${evidence.aGoals}/${evidence.aCount}. ${promote?`Enough evidence to increase B to ${maxAllocation}%.`:'Automatic growth is off. Review before increasing traffic.'}`);}
 if(evidence.significant&&evidence.lift<0){const reduce=automatic&&policy.reduceOnDrop;return result(reduce?'rollback':'hold',reduce?0:allocation,'Baseline A wins',`A meets the selected goals more often. ${reduce?'Stop B and keep A.':'Automatic reduction is off. Review B before continuing.'}`);}
 return result('hold',automatic&&!options.retainTraffic?0:allocation,'No clear winner',`A meets the goals on ${evidence.aGoals}/${evidence.aCount} calls; B on ${evidence.bGoals}/${evidence.bCount}. The evidence is not strong enough to pick a winner. ${options.retainTraffic?`Hold B at ${allocation}% and test further before expanding.`:'Keep A and test B further.'}`);
 }
 if(calls.length===30&&calls.some(c=>c.phase)&&!options.adaptiveAt30)return result('hold',50,'Check the improvement fairly','Use the fixed, balanced final comparison before choosing a winner. Its assignment is independent of earlier results.');
 if(calls.some(c=>c.phase==='confirmation'))return result('hold',allocation,'Keep the comparison steady','Keep traffic unchanged while checking whether B’s improvement holds.');
 if(a.count<5||b.count<3)return result('hold',allocation,'Collect more results','There are too few calls to change traffic safely. Keep the starting share for now.');
 if(pilotLift<-15&&pilotP<.01){const reduce=automatic&&policy.reduceOnDrop;return result(reduce?'rollback':'hold',reduce?0:allocation,'B is performing worse',`B meets fewer selected goals than A. ${reduce?'Stop B and keep A.':'Automatic reduction is off. Review the result.'}`);}
 if(pilotLift<-10||policy.protectCapture&&b.capture<a.capture-15){const reduce=automatic&&policy.reduceOnDrop;return result(reduce?'reduce':'hold',reduce?Math.max(5,Math.floor(allocation/2)):allocation,reduce?'Give B fewer calls':'Review B’s performance',`B meets the goals on ${Math.round(b.recovery)}% of calls; A on ${Math.round(a.recovery)}%. ${reduce?'Reduce B while checking more results.':'Automatic reduction is off.'}`);}
 if(pilotLift>=15&&(!policy.protectCapture||b.capture>=a.capture)&&allocation<Math.min(60,maxAllocation)){
 const next=Math.min(maxAllocation,60,allocation+policy.rampStep),promote=automatic&&policy.rampUp;
 return result(promote?'promote':'hold',promote?next:allocation,promote?`Increase B to ${next}%`:'B is improving',`B meets the selected goals on ${Math.round(b.recovery)}% of calls; A on ${Math.round(a.recovery)}%. ${promote?'Increase B’s share and keep checking.':'Automatic growth is off.'}`);
 }
 return result('hold',allocation,'Keep traffic unchanged',`A meets the goals on ${Math.round(a.recovery)}% of calls; B on ${Math.round(b.recovery)}%. Wait for clearer results before changing traffic.`);
}
export function shuffledCohort(seed=42){
 let state=seed>>>0;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};const ids=personas.map(p=>p.id);
 for(let i=ids.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}return ids;
}
export function batchPlan(round,allocation,scenario,seed=42){
 const order=shuffledCohort(seed),ranges=[[0,15],[15,30],[30,40],[40,50]],range=ranges[round];if(!range)return [];
 const ids=order.slice(...range);const confirmation=round>=2;
 // The complete 20-buyer confirmation assignment is frozen before any calls.
 const reserved=new Set(shuffledCohort(seed+7919).filter(id=>order.slice(30).includes(id)).slice(0,10));
 const count=Math.round(ids.length*allocation/100),assigned=confirmation?reserved:new Set(shuffledCohort(seed+round+913).filter(id=>ids.includes(id)).slice(0,count));
 return ids.map(id=>{
 const variant=assigned.has(id)?'B':'A',replay=scenarioReplay(scenario,round,variant),call=fixture(id,replay.variant,replay.scenario);
 return {...call,id:`${id}-${variant}`,variant,phase:confirmation?'confirmation':'pilot'};
 });
}
