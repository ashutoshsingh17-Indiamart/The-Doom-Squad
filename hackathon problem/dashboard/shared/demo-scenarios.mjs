// Prepared test conditions, not fabricated verdicts. Each selection points to an
// existing recording, transcript and independently cached evaluator result.
export const demoScenarios=[
 {id:'growth',name:'Sustained improvement',seed:8,description:'B improves, survives the final comparison and earns rollout.'},
 {id:'late-safety',name:'Early growth, safety stop',seed:8,description:'B expands initially, then an unsafe promise ends the test.'},
 {id:'fade',name:'Early growth, then retreat',seed:10,description:'The early gain fades; reduce exposure and keep the smaller share.'},
 {id:'recovery',name:'Slow start, then recovery',seed:1,description:'B needs time to find its footing; evidence can still be inconclusive.'},
 {id:'hold',name:'Close comparison',seed:6,description:'Similar results keep traffic steady; neither variant earns promotion.'},
 {id:'reverse',name:'Control performs better',seed:48,description:'A wins the final comparison; B is stopped.'},
];
export function scenarioReplay(scenario,round,variant){
 if(scenario==='regression'||scenario==='late-safety'&&round>=1)return {variant,scenario:variant==='B'?'regression':'growth'};
 if(scenario==='reverse'||scenario==='fade'&&round>=1)return {variant:variant==='B'?'A':'B',scenario:'growth'};
 if(scenario==='hold')return {variant:'A',scenario:'growth'};
 return {variant,scenario:'growth'};
}
export function scenarioPolicy(scenario){
 return ['fade','recovery','hold','reverse'].includes(scenario)?{adaptiveAt30:true,retainTraffic:true}:{};
}
let fallbackIndex=0;
export function nextDemoScenario(){
 const key='voiceops-next-scenario';let index=fallbackIndex;
 try{const value=Number(localStorage.getItem(key)??0);index=Number.isInteger(value)&&value>=0?value%demoScenarios.length:0;}catch{}
 const scenario=demoScenarios[index];fallbackIndex=(index+1)%demoScenarios.length;
 try{localStorage.setItem(key,String(fallbackIndex));}catch{}
 return scenario;
}
// Old seed/scenario links must not silently disable round-robin. A repeatable
// diagnostic replay requires the explicit pin=1 opt-in; normal starts rotate.
export function selectDemoScenario(search=''){
 const params=new URLSearchParams(search);
 if(params.get('pin')!=='1')return nextDemoScenario();
 const profile=demoScenarios.find(s=>s.id===params.get('scenario'))||demoScenarios[0];
 const value=params.get('seed'),seed=value!==null&&/^\d+$/.test(value)?Number(value)>>>0:profile.seed;
 return params.get('scenario')==='regression'?{id:'regression',name:'Safety regression',description:'Immediate safety stop.',seed}:{...profile,seed};
}
