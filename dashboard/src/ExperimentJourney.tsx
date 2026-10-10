import {useEffect,useState} from 'react';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Check,CheckCircle2,ChevronRight,Clock,FileText,FlaskConical,GitCompareArrows,Loader2,LockKeyhole,Play,ShieldCheck,Sparkles,Users,Zap} from 'lucide-react';
import {buyerGoals} from '../shared/domain.mjs';
import {promptPresets,selectedPresetIds} from '../shared/prompt-presets.mjs';
import type {RolloutOptions,GoalSelection} from '../shared/domain.mjs';

export type JourneyStep=1|2|3;
export type TestSettings={initial:number;maximum:number;automatic:boolean;goals:string[];rollout:RolloutOptions};
const steps=[{title:'Prompt variants',detail:'Control & challenger',icon:FileText},{title:'Experiment setup',detail:'Goals & traffic controls',icon:FlaskConical},{title:'Results & rollout',detail:'Calls & traffic decisions',icon:Play}];
export function JourneyStepper({step,canSetup,hasRun,locked,onStep}:{step:JourneyStep;canSetup:boolean;hasRun:boolean;locked:boolean;onStep:(s:JourneyStep)=>void}){
 return <nav className="journey-nav" aria-label="Experiment steps">{steps.map((s,i)=>{
  const n=(i+1) as JourneyStep,done=n<step;
  return <button key={s.title} aria-current={n===step?'step':undefined} disabled={locked&&n!==3||n===2&&!canSetup||n===3&&!hasRun} className={`journey-nav-step ${n===step?'current':''} ${done?'done':''}`} onClick={()=>onStep(n)}><span className="journey-nav-number">{done?<Check size={18}/>:n}</span><span><strong>{s.title}</strong><small>{s.detail}</small></span>{i<2&&<ChevronRight size={18} className="journey-nav-arrow"/>}</button>;
 })}</nav>;
}

// Compare instructions, so a model's whitespace changes do not look like a full rewrite.
function promptDiff(before:string,after:string){
 const instructions=(text:string)=>text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])/).map(s=>s.trim()).filter(Boolean);
 const a=instructions(before),b=instructions(after),grid=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
 for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)grid[i][j]=a[i]===b[j]?grid[i+1][j+1]+1:Math.max(grid[i+1][j],grid[i][j+1]);
 const rows:{kind:'same'|'added'|'removed';text:string}[]=[];let i=0,j=0;
 while(i<a.length||j<b.length){if(i<a.length&&j<b.length&&a[i]===b[j]){rows.push({kind:'same',text:a[i++]});j++;}else if(j<b.length&&(i===a.length||grid[i][j+1]>grid[i+1][j]))rows.push({kind:'added',text:b[j++]});else rows.push({kind:'removed',text:a[i++]});}
 return rows;
}
function DiffPreview({rows}:{rows:ReturnType<typeof promptDiff>}){
 const groups:{kind:string;rows:typeof rows}[]=[];
 for(const row of rows){if(groups.at(-1)?.kind===row.kind)groups.at(-1)!.rows.push(row);else groups.push({kind:row.kind,rows:[row]});}
 const line=(r:typeof rows[number],i:number)=><div key={i} className={`diff-line ${r.kind}`}><span>{r.kind==='added'?'+':r.kind==='removed'?'−':' '}</span><code>{r.text}</code></div>;
 return <div className="journey-diff" aria-label="Prompt changes">{groups.map((group,i)=>group.kind==='same'&&group.rows.length>3?<details className="unchanged-instructions" key={i}><summary>{group.rows.length} unchanged instructions</summary>{group.rows.map(line)}</details>:<div key={i}>{group.rows.map(line)}</div>)}</div>;
}
type PromptProps={promptA:string;promptB:string;improvement:string;acceptedRequest:string;source:string;changes:string[];hypothesis:string;models:{id:string;name:string}[];model:string;generating:boolean;onRequest:(text:string)=>void;onSuggestion:(id:string)=>void;onModel:(model:string)=>void;onGenerate:()=>void;onEdit:(v:'A'|'B')=>void;onNext:()=>void};
export function PromptStep(p:PromptProps){
 const [editing,setEditing]=useState(false),[view,setView]=useState<'diff'|'full'>('diff');
 useEffect(()=>{if(p.promptB.trim()&&p.acceptedRequest===p.improvement)setEditing(false);},[p.promptB,p.acceptedRequest]);
 const hasB=!!p.promptB.trim(),requestVisible=!hasB||editing,chosenIds=selectedPresetIds(p.acceptedRequest);
 const rows=hasB?promptDiff(p.promptA,p.promptB):[],added=rows.filter(r=>r.kind==='added'&&r.text.trim()).length,removed=rows.filter(r=>r.kind==='removed'&&r.text.trim()).length;
 function request(text:string){setEditing(true);p.onRequest(text);}
 return <div className="journey-stage" key="prompts">
  <div className="stage-heading"><div><span className="stage-kicker">STEP 01 · PROMPTS</span><h2 tabIndex={-1} className="stage-title">Create your challenger prompt.</h2><p>Choose an improvement or write your own, then review the changes.</p></div><span className={`stage-status ${hasB?'ready':''}`}><i/>{hasB?'Challenger ready':'Draft experiment'}</span></div>
  <div className="journey-prompt-grid">
   <section className="panel journey-prompt-card control"><div className="journey-card-heading"><span className="variant-tag a">A</span><div><h3>The control</h3><p>Your current requirement collection prompt</p></div><span className="badge">Baseline</span></div>
    <div className="prompt-code-label"><span><i/> Current conversation rules</span><button className="text-button" onClick={()=>p.onEdit('A')}>Edit prompt</button></div>
    <pre className="journey-prompt-code" aria-label="Control prompt">{p.promptA}</pre>
    <div className="prompt-protection"><ShieldCheck size={17}/><div><strong>Built-in collection guardrails</strong><p>Buying intent, one question at a time, honest capture and respectful refusals.</p></div></div>
   </section>
   <section className={`panel journey-prompt-card challenger ${hasB?'has-prompt':''}`}><div className="journey-card-heading"><span className="variant-tag b">B</span><div><h3>Your challenger</h3><p>{hasB?'A focused change, ready for your review':'What would make the conversation better?'}</p></div><Sparkles size={21}/></div>
    <div className="suggestion-chips instant-suggestions"><span>{hasB?'Add or remove improvements':'Choose one or more improvements'}</span>{promptPresets.map(s=>{const on=hasB&&chosenIds.includes(s.id);return <button key={s.id} className={on?'chosen':''} aria-pressed={on} disabled={p.generating} onClick={()=>p.onSuggestion(s.id)}>{s.label}{on?<Check size={13}/>:<span>+</span>}</button>;})}</div>
    {requestVisible&&<div className="challenger-request"><label htmlFor="improvement">Describe the improvement</label><textarea id="improvement" placeholder="e.g. Buyers sound busy. Make the flow shorter and skip details they already gave…" value={p.improvement} disabled={p.generating} maxLength={1500} onChange={e=>request(e.target.value)} rows={4}/>
     <div className="challenger-generate"><button className="button primary" onClick={p.onGenerate} disabled={p.generating||!p.improvement.trim()||!p.model}>{p.generating?<Loader2 size={16} className="spin"/>:<Sparkles size={16}/>} {p.generating?'Writing your challenger…':hasB?'Regenerate variant B':'Generate variant B'}</button>{editing&&hasB&&<button className="text-button" onClick={()=>{p.onRequest(p.acceptedRequest);setEditing(false);}}>Keep current variant</button>}</div>
     <details className="generator-options"><summary>Writing options</summary><label>Prompt writer<select aria-label="Prompt writer model" disabled={p.generating} value={p.model} onChange={e=>p.onModel(e.target.value)}>{!p.models.length&&<option>Loading models…</option>}{p.models.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label><button className="text-button" disabled={p.generating} onClick={()=>p.onEdit('B')}>Write B manually</button></details>
    </div>}
    {p.generating?<div className="challenger-writing" role="status"><div className="writing-orb"><Sparkles size={24}/></div><strong>Turning your idea into conversation rules</strong><span>The prompt writer keeps the collection guardrails.</span><div className="writing-lines"><i/><i/><i/></div></div>:hasB?<div className="challenger-review">
     <div className="change-summary"><div><CheckCircle2 size={18}/><strong>What changes in B</strong></div>{p.hypothesis&&<p>{p.hypothesis}</p>}{p.changes.length>0&&<ul>{p.changes.map((c,i)=><li key={i}>{c}</li>)}</ul>}</div>
     <div className="diff-toolbar"><div className="view-switch" role="group" aria-label="Challenger preview"><button aria-pressed={view==='diff'} className={view==='diff'?'active':''} onClick={()=>setView('diff')}><GitCompareArrows size={14}/>Changes</button><button aria-pressed={view==='full'} className={view==='full'?'active':''} onClick={()=>setView('full')}>Full prompt</button></div><span className="diff-count"><b>+{added}</b><em>−{removed}</em></span><button className="text-button" onClick={()=>p.onEdit('B')}>Edit</button></div>
     {view==='full'?<pre className="journey-prompt-code challenger-code" aria-label="Challenger prompt">{p.promptB}</pre>:<DiffPreview rows={rows}/>}
    </div>:<div className="challenger-empty"><span><GitCompareArrows size={25}/></span><strong>Your new prompt will appear here</strong><p>See exactly what changed before you run the test.</p></div>}
    {hasB&&!p.generating&&<div className="challenger-review-actions"><button className="button secondary" onClick={()=>{if(editing)p.onRequest(p.acceptedRequest);setEditing(!editing);}}>{editing?'Close request':'Change request'}</button><button className="button primary" disabled={editing||p.acceptedRequest!==p.improvement} onClick={p.onNext}>Next: set up experiment<ArrowRight size={16}/></button></div>}
   </section>
  </div>
  <div className="journey-bottom-note"><ShieldCheck size={15}/><span>Prompt versions are frozen when you launch. You can always come back before starting.</span></div>
 </div>;
}

function Switch({label,on,onChange,disabled=false}:{label:string;on:boolean;onChange:()=>void;disabled?:boolean}){return <button role="switch" aria-label={label} aria-checked={on} disabled={disabled} className={`toggle ${on?'on':''}`} onClick={onChange}><i/></button>;}
export function SetupStep({settings:s,onChange,onBack,onStart,ready}:{settings:TestSettings;onChange:(settings:Partial<TestSettings>)=>void;onBack:()=>void;onStart:()=>void;ready:boolean}){
 const selected=s.goals.length;
 const updatePolicy=(patch:Partial<RolloutOptions>)=>onChange({rollout:{...s.rollout,...patch}});
 function toggleGoal(id:string){onChange({goals:buyerGoals.filter(g=>g.id===id?!s.goals.includes(id):s.goals.includes(g.id)).map(g=>g.id)});}
 return <div className="journey-stage cockpit-stage">
  <div className="stage-heading"><div><span className="stage-kicker">STEP 02 &middot; SETUP</span><h2 tabIndex={-1} className="stage-title">Experiment setup</h2><p>Choose collection goals and control how B receives more calls.</p></div><span className="stage-status ready"><i/>Prompts ready</span></div>
  <div className="cockpit-grid"><div className="cockpit-main">
   <section className="panel cockpit-panel goal-cockpit"><div className="cockpit-heading"><span className="cockpit-icon"><CheckCircle2 size={20}/></span><div><h3>Collection goals</h3><p>Choose the details your agent needs to collect.</p></div><span className="selected-count">{selected} selected</span></div>
    <div className="buyer-goal-selectors">{buyerGoals.map((g,i)=><div className={`buyer-goal-card ${s.goals.includes(g.id)?'selected':''}`} key={g.id}><span className="goal-number">0{i+1}</span><Switch label={g.name} on={s.goals.includes(g.id)} onChange={()=>toggleGoal(g.id)}/><strong>{g.name}</strong><p>{g.description}</p></div>)}</div>
    <div className={`goal-selection-note ${selected?'':'needs-goal'}`}><Check size={15}/><span>{selected?'A call succeeds when it meets every selected goal.':'Select at least one goal to start the experiment.'}</span></div>
   </section>
   <section className="panel cockpit-panel traffic-cockpit"><div className="cockpit-heading"><span className="cockpit-icon blue"><Users size={20}/></span><div><h3>Traffic allocation</h3><p>Start with a small share and set room to grow.</p></div></div>
    <div className="traffic-control"><div><label htmlFor="initial-traffic">Start B at</label><strong>{s.initial}<span>%</span></strong></div><input id="initial-traffic" aria-label="Initial B traffic percentage" type="range" min="5" max="50" step="5" value={s.initial} onChange={e=>onChange({initial:Number(e.target.value)})}/><div className="traffic-scale"><span>5%</span><span>50%</span></div><div className="cockpit-traffic-bar"><div style={{width:`${100-s.initial}%`}}>A &middot; {100-s.initial}%</div><div style={{width:`${s.initial}%`}}>B &middot; {s.initial}%</div></div></div>
    <div className="traffic-controls-pair"><div><label>Increase B by</label><div className="cockpit-segments" role="group" aria-label="Traffic increase step">{[10,20,25].map(v=><button key={v} aria-pressed={s.rollout.rampStep===v} className={s.rollout.rampStep===v?'active':''} onClick={()=>updatePolicy({rampStep:v})}>+{v}%</button>)}</div><p>At each positive checkpoint.</p></div><div><label>Maximum B share</label><div className="cockpit-segments" role="group" aria-label="Maximum B share">{[50,75,100].map(v=><button key={v} aria-pressed={s.maximum===v} className={s.maximum===v?'active':''} onClick={()=>onChange({maximum:v})}>{v}%</button>)}</div><p>Only after B wins the test.</p></div></div>
   </section>
  </div><aside className="cockpit-side">
   <section className="panel cockpit-panel automation-cockpit"><div className="cockpit-heading"><span className="cockpit-icon violet"><Zap size={20}/></span><div><h3>Automatic actions</h3><p>Control what happens as results arrive.</p></div></div>
    <div className="cockpit-segments action-mode" role="group" aria-label="Rollout mode"><button aria-pressed={s.automatic} className={s.automatic?'active':''} onClick={()=>onChange({automatic:true})}><Zap size={14}/>Automatic</button><button aria-pressed={!s.automatic} className={!s.automatic?'active':''} onClick={()=>onChange({automatic:false})}>Review first</button></div>
    <div className={`automation-controls ${!s.automatic?'manual':''}`}>
     <div className="automation-row"><span className="automation-symbol green"><ArrowUp size={17}/></span><div><strong>Grow B when it performs better</strong><p>Increase its share when more calls meet your goals.</p></div><Switch label="Grow B when it performs better" on={s.rollout.rampUp} disabled={!s.automatic} onChange={()=>updatePolicy({rampUp:!s.rollout.rampUp})}/></div>
     <div className="automation-row"><span className="automation-symbol coral"><ArrowDown size={17}/></span><div><strong>Reduce B if results get worse</strong><p>Give B fewer calls when it falls behind A.</p></div><Switch label="Reduce B if results get worse" on={s.rollout.reduceOnDrop} disabled={!s.automatic} onChange={()=>updatePolicy({reduceOnDrop:!s.rollout.reduceOnDrop})}/></div>
     <div className="automation-row"><span className="automation-symbol blue"><ShieldCheck size={17}/></span><div><strong>Keep the quality of collected details</strong><p>Block growth if B records fewer details than A.</p></div><Switch label="Keep the quality of collected details" on={s.rollout.protectCapture} onChange={()=>updatePolicy({protectCapture:!s.rollout.protectCapture})}/></div>
    </div>
    {!s.automatic&&<p className="manual-mode-note">You review each recommendation before changing traffic.</p>}
    <div className="always-on-rule"><ShieldCheck size={15}/><span>Unsafe price or availability promises stop B immediately.</span><span>Always on</span></div>
   </section>
   <section className="panel cockpit-panel confidence-cockpit"><div className="cockpit-heading"><span className="cockpit-icon mint"><ShieldCheck size={20}/></span><div><h3>Rollout confidence</h3><p>Evidence needed before declaring a winner.</p></div></div><div className="confidence-options" role="group" aria-label="Evidence required">{[{id:'standard',label:'Standard',text:'Confirm a clear improvement.'},{id:'strong',label:'Stronger evidence',text:'Be more cautious before rollout.'}].map(option=><button key={option.id} aria-pressed={s.rollout.evidence===option.id} className={s.rollout.evidence===option.id?'selected':''} onClick={()=>updatePolicy({evidence:option.id})}><span className="choice-dot"/><span><strong>{option.label}</strong><small>{option.text}</small></span>{s.rollout.evidence===option.id&&<Check size={15}/>}</button>)}</div></section>
  </aside></div>
  <div className="cockpit-launch"><button className="button secondary" onClick={onBack}><ArrowLeft size={16}/>Back to prompts</button><div className="launch-summary"><span>{selected} goals</span><i/><span>B starts at {s.initial}%</span><i/><span>{s.automatic?'Auto rollout':'Review first'}</span></div><button className="button primary" disabled={!ready||!selected||s.initial>s.maximum} onClick={onStart}><Play size={15} fill="currentColor"/>Start experiment<ArrowRight size={16}/></button></div>
 </div>;
}
export function RunHeading({status,calls,goal,initial,onReview}:{status:string;calls:number;goal:GoalSelection;initial:number;onReview:(v:'A'|'B')=>void}){
 const complete=status==='completed';
 return <><div className="stage-heading"><div><span className="stage-kicker">STEP 03 &middot; RESULTS</span><h2 tabIndex={-1} className="stage-title">{complete?'Experiment complete. Review your results.':'Your experiment is running.'}</h2><p>Follow call results and see how B earns its next traffic change.</p></div><span className={`stage-status ${status==='running'?'live':complete?'ready':''}`}><i/>{complete?'Complete':status==='paused'?'Paused':'Running'}</span></div>
 <div className="run-context"><div><CheckCircle2 size={16}/><strong>{Array.isArray(goal)?goal.length:1}</strong><span>active goals</span></div><div><FlaskConical size={16}/><strong>{initial}%</strong><span>starting B share</span></div><div><Users size={16}/><strong>{calls}</strong><span>calls evaluated</span></div><div className="frozen-prompts"><LockKeyhole size={13}/><span>Prompt versions</span><button onClick={()=>onReview('A')}>A</button><button onClick={()=>onReview('B')}>B</button></div></div></>;
}
