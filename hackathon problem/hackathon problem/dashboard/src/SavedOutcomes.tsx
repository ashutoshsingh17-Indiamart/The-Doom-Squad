import {ArrowDownRight,ArrowRight,ArrowUpRight,CheckCircle2,Clock,Download,FlaskConical,FolderOpen,Loader2,RotateCcw,ShieldCheck} from 'lucide-react';
import {aggregate} from '../shared/domain.mjs';
import type {ReplayRun} from '../shared/experiment-run.mjs';
import './saved-outcomes.css';

export type SavedOutcome={id:string;name:string;status:string;scenario:string;created_at:string;payload:ReplayRun&{improvement?:string}};
type Props={outcomes:SavedOutcome[];loading:boolean;connected:boolean;locked:boolean;onRefresh:()=>void;onOpen:(outcome:SavedOutcome)=>void;onDownload:(outcome:SavedOutcome)=>void};

function outcomeKind(run:ReplayRun){
 const decision=run.decisions.at(-1),safety=run.calls.some(c=>c.guardrails.length);
 if(safety)return {label:'Safety stop',tone:'stopped',Icon:ShieldCheck};
 if(decision?.title==='Baseline A wins')return {label:'A wins',tone:'control',Icon:CheckCircle2};
 if(decision?.action==='winner')return {label:'B wins',tone:'winner',Icon:ArrowUpRight};
 if(run.decisions.some(d=>d.action==='reduce'))return {label:'Reduced & held',tone:'retreat',Icon:ArrowDownRight};
 return {label:'Keep testing',tone:'testing',Icon:Clock};
}

function TrafficPreview({run}:{run:ReplayRun}){
 const values=[run.initial,...run.decisions.map(d=>d.allocation)],x=(i:number)=>16+i*298/Math.max(1,values.length-1),y=(v:number)=>90-v*.54,points=values.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
 return <div className="saved-traffic"><div><span>Variant B traffic</span><strong>{run.allocation}% <small>final share</small></strong></div><svg viewBox="0 0 330 124" role="img" aria-label={`B traffic: ${values.join(', ')} percent`}><line x1="16" x2="314" y1="92" y2="92" className="saved-chart-axis"/><polygon points={`16,92 ${points} ${x(values.length-1)},92`} className="saved-chart-fill"/><polyline points={points} className="saved-chart-line"/>{values.map((v,i)=><g key={i}><circle cx={x(i)} cy={y(v)} r={i===values.length-1?4:3}/><text x={x(i)} y={y(v)-12} textAnchor="middle" className="saved-chart-value">{v}%</text><text x={x(i)} y="116" textAnchor="middle" className="saved-chart-label">{i?`C${i}`:'Start'}</text></g>)}</svg></div>;
}

export function SavedOutcomes({outcomes,loading,connected,locked,onRefresh,onOpen,onDownload}:Props){
 const complete=outcomes.filter(h=>h.status==='completed'||h.status==='stopped'),calls=complete.reduce((n,h)=>n+h.payload.calls.length,0),checkpoints=complete.reduce((n,h)=>n+h.payload.decisions.length,0);
 return <div className="saved-outcomes">
 <div className="saved-library-summary"><div><span className="saved-library-icon"><FolderOpen size={23}/></span><div><strong>Explore the decisions behind each result</strong><p>Open any card to follow its traffic journey, inspect calls and read the recommendation.</p></div></div><div className="saved-library-actions"><span className={`saved-connection ${connected?'connected':''}`}><i/>{connected?'All outcomes saved':'Storage unavailable'}</span><button className="icon-button" onClick={onRefresh} aria-label="Refresh sample outputs"><RotateCcw size={16}/></button></div></div>
 {complete.length>0&&<div className="saved-library-totals"><span><strong>{complete.length}</strong> sample outputs</span><span><strong>{calls}</strong> calls evaluated</span><span><strong>{checkpoints}</strong> decisions to inspect</span></div>}
 {locked&&<p className="saved-active-notice">Finish the current experiment to open another outcome. Reports are available below.</p>}
 {loading&&!complete.length?<div className="panel saved-empty"><Loader2 size={24} className="spin"/><h2>Loading sample outputs</h2></div>:complete.length?<div className="saved-outcome-grid">{complete.map(h=>{
 const run=h.payload,kind=outcomeKind(run),a=aggregate(run.calls,'A',run.goal),b=aggregate(run.calls,'B',run.goal);
 return <article className={`panel saved-outcome-card ${kind.tone} ${locked?'locked':''}`} key={h.id} aria-labelledby={`outcome-${h.id}`}>
 <div className="saved-card-heading"><span className="saved-outcome-icon"><kind.Icon size={20}/></span><span className="saved-outcome-badge">{kind.label}</span></div>
 <h2 id={`outcome-${h.id}`}>{h.name}</h2><p className="saved-card-description">{run.decisions.at(-1)?.title||'Experiment completed'}</p>
 <TrafficPreview run={run}/>
 <div className="saved-goal-results"><span className="saved-goal-caption">Calls meeting all selected goals</span>{[a,b].map((arm,i)=><div className="saved-arm-result" key={i}><span className={`variant-tag ${i?'b':'a'}`}>{i?'B':'A'}</span><span className="saved-success-track"><i style={{width:`${arm.recovery}%`}}/></span><strong>{Math.round(arm.recovery)}%</strong><small>{arm.goals}/{arm.count}</small></div>)}</div>
 <div className="saved-card-facts"><span><FlaskConical size={14}/>{run.calls.length} calls · {run.decisions.length} checkpoints</span><span>{new Date(h.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
 <div className="saved-card-actions"><button className="button secondary saved-open-button" disabled={locked} onClick={()=>onOpen(h)}>Open outcome <ArrowRight size={15}/></button><button className="icon-button" onClick={()=>onDownload(h)} aria-label={`Download PDF: ${h.name}`} title="Download PDF report"><Download size={17}/></button></div>
 </article>;
 })}</div>:<div className="panel saved-empty"><FolderOpen size={28}/><h2>No sample outputs yet</h2><p>Complete an experiment to keep its result and call evidence here.</p></div>}
 </div>;
}
