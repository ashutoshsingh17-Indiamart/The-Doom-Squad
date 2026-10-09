import {Check,Minus,ChevronRight,ListOrdered,ArrowRight} from 'lucide-react';
import {buyerGoals,callMeetsGoal,callMeetsGoals} from '../shared/domain.mjs';
import type {Call,GoalSelection} from '../shared/domain.mjs';
import {goalComparison,experimentRounds} from '../shared/decision-audit.mjs';
import type {AuditRun} from '../shared/decision-audit.mjs';
import {useState} from 'react';

export function GoalComparisonTable({calls,goal,compact=false}:{calls:Call[];goal:GoalSelection;compact?:boolean}){
 return <table className={`checkpoint-goals ${compact?'compact':''}`}><thead><tr><th>Goal</th><th>A</th><th>B</th></tr></thead><tbody>{goalComparison(calls,goal).map(row=><tr key={row.id} className={row.id==='all'?'combined-goals':''}><th scope="row">{row.label}</th>{(['A','B'] as const).map(v=><td key={v}><strong>{row[v].rate===null?'—':`${Math.round(row[v].rate)}%`}</strong><small>{row[v].met}/{row[v].total}</small></td>)}</tr>)}</tbody></table>;
}

export function CallTable({calls,goal,onSelect,allCalls=calls}:{calls:Call[];goal:GoalSelection;onSelect:(c:Call)=>void;allCalls?:Call[]}){
 const selected=Array.isArray(goal)?buyerGoals.filter(g=>goal.includes(g.id)):[];
 return calls.length?<div className="table-scroll audit-call-scroll" tabIndex={0} aria-label="Call results table"><table className="call-table audit-call-table"><thead><tr><th>Call</th><th>Buyer / product</th><th>Variant</th><th>Outcome</th>{selected.map(g=><th key={g.id}>{g.name}</th>)}<th>{selected.length?'All goals':String(goal)}</th><th>Duration</th><th><span className="sr-only">Inspect</span></th></tr></thead><tbody>{calls.map((c,i)=>{
 const met=callMeetsGoals(c,goal);return <tr key={`${c.id}-${i}`} onClick={()=>onSelect(c)}><td className="call-sequence">#{allCalls.indexOf(c)+1}</td><td><div className="buyer-cell"><div><strong>{c.persona.name}</strong><span>{c.product.name} · {c.persona.city}</span></div></div></td><td><span className={`variant-tag ${c.variant==='A'?'a':'b'}`}>{c.variant}</span></td><td><span className={`outcome ${c.guardrails.length?'red':met?'green':!c.eligible?'neutral':'amber'}`}><i/>{c.disposition||'Legacy outcome'}</span></td>{selected.map(g=>{const pass=callMeetsGoal(c,g.id);return <td key={g.id}><span className={`goal-verdict ${pass?'met':'missed'}`}>{pass?<Check size={13}/>:<Minus size={13}/>}<span>{pass?'Met':'Not met'}</span></span></td>;})}<td><span className={`goal-verdict ${met?'met':'missed'}`}>{met?'Passed':'Not passed'}</span></td><td>{c.duration}s</td><td><button className="icon-button" aria-label={`View ${c.persona.name} call`} onClick={e=>{e.stopPropagation();onSelect(c);}}><ChevronRight size={16}/></button></td></tr>;
 })}</tbody></table></div>:<div className="audit-empty">No calls in this view yet.</div>;
}

export function RoundLog({exp,onSelect}:{exp:AuditRun;onSelect:(c:Call)=>void}){
 const [open,setOpen]=useState(false),rounds=experimentRounds(exp);
 return <section className="panel round-log"><div className="panel-heading"><div><h2><ListOrdered size={19}/>Step-by-step activity</h2><p>Every buyer, assignment and outcome, in the order they happened.</p></div><button className="button secondary small" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'Hide activity':'Show activity'}</button></div>{open&&<div className="round-log-body"><div className="log-launch"><span className="log-dot"/><strong>Experiment launched</strong><span>A {100-exp.initial}% · B {exp.initial}% starting allocation</span></div>{rounds.map(round=>{
 const a=round.calls.filter(c=>c.variant==='A').length,b=round.calls.length-a,confirm=round.calls.some(c=>c.phase==='confirmation');
 return <details className="round-entry" key={round.index} open><summary><span className="round-number">{String(round.index+1).padStart(2,'0')}</span><span><strong>Round {round.index+1}</strong><small>Calls {round.start+1}–{round.end} · {confirm?'Final comparison':'Traffic test'}</small></span><span className="round-assignment"><b>A {a}</b><b>B {b}</b><small>{round.allocation}% B target</small></span><ChevronRight size={17}/></summary><CallTable calls={round.calls} allCalls={exp.calls} goal={exp.goal} onSelect={onSelect}/>{round.decision?<div className="log-decision"><ArrowRight size={17}/><div><strong>Checkpoint {round.index+1} · B {round.allocation}% → {round.decision.allocation}%</strong><p>{round.decision.reason}</p></div></div>:<div className="log-decision"><span>Round in progress · decision pending</span></div>}</details>;
 })}{!rounds.length&&<p className="audit-empty">The first call will appear here when it completes.</p>}</div>}</section>;
}
