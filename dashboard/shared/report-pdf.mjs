import {aggregate,significance,buyerGoals,defaultRollout,callMeetsGoal,callMeetsGoals,goalLabel} from './domain.mjs';
import {goalComparison,experimentRounds} from './decision-audit.mjs';
import {demoScenarios} from './demo-scenarios.mjs';

// Dependency-free, searchable PDF using the standard PDF Helvetica fonts.
// Report labels are English. The stored experiment retains original prompt text.
const ink='#34445e',muted='#8490a4',purple='#7865b1',line='#e4e8f1',green='#3c9278';
const clean=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,'-').replace(/\u2192/g,' -> ').replace(/\u00b7/g,' / ').replace(/[^\x20-\x7e\n]/g,'?');
const literal=value=>clean(value).replace(/([\\()])/g,'\\$1');
const rgb=hex=>[1,3,5].map(i=>(parseInt(hex.slice(i,i+2),16)/255).toFixed(4)).join(' ');
const width=(text,size)=>[...clean(text)].reduce((n,c)=>n+(" ilI.,:;'!|".includes(c)?.24:'mwMW@%'.includes(c)?.83:'ABCDEFGHKNOPQRSTUVXYZ0123456789'.includes(c)?.64:.5),0)*size;
function wrap(text,max,size){
 const lines=[];
 for(const paragraph of clean(text).split('\n')){
  let current='';for(const word of paragraph.split(/\s+/)){
   if(width(current?current+' '+word:word,size)>max&&current){lines.push(current);current='';}
   // Long identifiers and arbitrary prompt words cannot run outside the page.
   let remaining=word;while(width(remaining,size)>max){let cut=Math.max(1,Math.floor(max/size));while(width(remaining.slice(0,cut),size)>max)cut--;if(current){lines.push(current);current='';}lines.push(remaining.slice(0,cut));remaining=remaining.slice(cut);}
   current+=(current?' ':'')+remaining;
  }lines.push(current);
 }return lines;
}
class PDF{
 constructor(){this.pages=[];}
 page(label,landscape=false){this.w=landscape?842:595;this.h=landscape?595:842;this.commands=[];this.pages.push({commands:this.commands,w:this.w,h:this.h});this.label=label;this.y=93;
  this.rect(0,0,this.w,6,purple);this.text('voiceops.',40,38,17,true,purple);this.text('INDIAMART / EXPERIMENT REPORT',this.w-40,36,8,true,muted,'right');this.rule(40,56,this.w-80);this.text(label,40,76,8,false,muted);
 }
 text(text,x,y,size=10,bold=false,color=ink,align='left'){
  const value=clean(text);if(align==='right')x-=width(value,size);if(align==='center')x-=width(value,size)/2;
  this.commands.push(`BT /${bold?'F2':'F1'} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${x.toFixed(2)} ${(this.h-y).toFixed(2)} Tm (${literal(value)}) Tj ET`);
 }
 rect(x,y,w,h,fill,stroke=null){this.commands.push(`${rgb(fill)} rg ${stroke?rgb(stroke)+' RG ':''}${x} ${this.h-y-h} ${w} ${h} re ${stroke?'B':'f'}`);}
 rule(x,y,w,color=line){this.commands.push(`${rgb(color)} RG .6 w ${x} ${this.h-y} m ${x+w} ${this.h-y} l S`);}
 paragraph(text,x,y,max,size=10,color=muted,leading=size*1.6,bold=false){const lines=wrap(text,max,size);for(const [i,l]of lines.entries())this.text(l,x,y+i*leading,size,bold,color);return y+lines.length*leading;}
 heading(title,subtitle=''){this.text(title,40,this.y+16,24,true);this.y+=42;if(subtitle)this.y=this.paragraph(subtitle,40,this.y,this.w-80,10,muted)+12;}
 footer(index,total,id){this.rule(40,this.h-42,this.w-80);this.text(`VoiceOps / ${id.slice(0,8)} / Sandbox`,40,this.h-25,8,false,muted);this.text(`${index+1} / ${total}`,this.w-40,this.h-25,8,false,muted,'right');}
 finish(id){
  this.pages.forEach((p,i)=>{this.commands=p.commands;this.w=p.w;this.h=p.h;this.footer(i,this.pages.length,id);});
  const objs=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'];
  const kids=[];for(const p of this.pages){const pageId=objs.length+1,contentId=pageId+1;kids.push(`${pageId} 0 R`);const stream=p.commands.join('\n');objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${p.w} ${p.h}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);objs.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);}
  objs[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
  let doc='%PDF-1.4\n',offsets=[0];for(const [i,obj]of objs.entries()){offsets.push(doc.length);doc+=`${i+1} 0 obj\n${obj}\nendobj\n`;}
  const start=doc.length;doc+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
  return new TextEncoder().encode(doc);
 }
}
const pct=rate=>rate===null?'--':`${Math.round(rate)}%`;
function goalTable(pdf,calls,goal,x,y,w,title){
 const rows=goalComparison(calls,goal),a=calls.filter(c=>c.variant==='A').length,b=calls.length-a;
 pdf.text(title,x,y,10,true);y+=18;pdf.rect(x,y,w,38,'#f5f6fb');pdf.text(`A  ${a} calls`,x+12,y+24,12,true);pdf.text(`B  ${b} calls`,x+w-12,y+24,12,true,purple,'right');y+=52;
 pdf.text('SELECTED GOAL',x,y,7,true,muted);pdf.text('A',x+w*.7,y,8,true,muted,'right');pdf.text('B',x+w-4,y,8,true,purple,'right');y+=12;
 for(const row of rows){if(row.id==='all')pdf.rect(x,y,w,49,'#f5f3fb');pdf.paragraph(row.label,x+5,y+18,w*.52,9,row.id==='all'?ink:muted,12,row.id==='all');for(const [variant,right]of [['A',x+w*.7],['B',x+w-5]]){const v=row[variant];pdf.text(pct(v.rate),right,y+19,11,true,variant==='B'?purple:ink,'right');pdf.text(`${v.met}/${v.total}`,right,y+34,8,false,muted,'right');}pdf.rule(x,y+49,w);y+=49;}
 return y;
}
function metric(pdf,x,y,w,label,value,color=ink){pdf.rect(x,y,w,68,'#f7f8fc',line);pdf.text(label.toUpperCase(),x+12,y+18,7,true,muted);pdf.text(value,x+12,y+49,23,true,color);}
function callPages(pdf,exp,round){
 const selected=Array.isArray(exp.goal)?buyerGoals.filter(g=>exp.goal.includes(g.id)):[],cols=[24,159,32,116,...selected.map(()=>66),55,46];
 // 730 points are available on a landscape A4 page; adapt for 1-3 goals.
 const scale=730/cols.reduce((a,b)=>a+b,0);const widths=cols.map(w=>w*scale),xs=[40];for(const w of widths)xs.push(xs.at(-1)+w);
 let offset=0;
 do{
  pdf.page(`STAGE ${round.index+1} / CALL AUDIT`,true);pdf.heading(`Stage ${round.index+1}: call audit`, 'Original call order. Each goal is a separate result; unanswered calls remain in the denominator.');
  const first=offset;let y=pdf.y;pdf.rect(40,y,730,28,'#f1f2f9');const headings=['#','BUYER / PRODUCT','ARM','OUTCOME',...selected.map(g=>g.short||g.name),'All goals','SECONDS'];
  headings.forEach((h,i)=>pdf.paragraph(h,xs[i]+5,y+12,widths[i]-9,7,muted,9,true));y+=28;
  while(offset<round.calls.length&&y+53<pdf.h-80){const c=round.calls[offset];if(offset%2===0)pdf.rect(40,y,730,49,'#fafbfe');pdf.text(String(round.start+offset+1),xs[0]+5,y+18,8,false,muted);pdf.text(c.persona.name,xs[1]+5,y+17,9,true);pdf.text(`${c.product.name} / ${c.persona.city}`,xs[1]+5,y+33,7,false,muted);pdf.text(c.variant,xs[2]+5,y+18,9,true,c.variant==='B'?purple:ink);pdf.paragraph(c.disposition,xs[3]+5,y+17,widths[3]-10,8,muted,10);selected.forEach((g,i)=>{const met=callMeetsGoal(c,g.id);pdf.text(met?'Met':'Not met',xs[4+i]+5,y+18,8,false,met?green:muted);});const combined=callMeetsGoals(c,exp.goal);pdf.text(combined?'Passed':'Not met',xs[4+selected.length]+5,y+18,8,true,combined?green:muted);pdf.text(`${c.duration}s`,xs.at(-2)+5,y+18,8,false,muted);pdf.rule(40,y+49,730);y+=49;offset++;}
  pdf.text(`Stage calls: A ${round.calls.filter(c=>c.variant==='A').length} / B ${round.calls.filter(c=>c.variant==='B').length}`,40,y+19,9,true);pdf.text(`Showing calls ${round.start+first+1}-${round.start+offset} / ${exp.calls.length} total`,770,y+19,8,false,muted,'right');
 }while(offset<round.calls.length);
}
function promptPages(pdf,prompt,label){
 const lines=wrap(prompt||'No prompt saved.',515,10);let i=0;do{pdf.page('APPENDIX / PROMPT VERSIONS');pdf.heading(`${label}${i?' (continued)':''}`,'Prompt frozen at experiment launch.');while(i<lines.length&&pdf.y<pdf.h-62){pdf.text(lines[i++],40,pdf.y,10,false,ink);pdf.y+=16;} }while(i<lines.length);
}
export function experimentPDF(exp){
 const pdf=new PDF(),a=aggregate(exp.calls,'A',exp.goal),b=aggregate(exp.calls,'B',exp.goal),final=exp.decisions.at(-1),e=significance(exp.calls.filter(c=>c.phase==='confirmation'),exp.goal),threshold=exp.rollout?.evidence==='strong'?.01:.05,rounds=experimentRounds(exp);
 pdf.page('RESULTS / EXECUTIVE SUMMARY');pdf.heading('Requirement collection',exp.name);
 pdf.text(final?.title||'Experiment in progress',40,pdf.y,15,true,purple);pdf.y=pdf.paragraph(final?.reason||'Results are still being collected.',40,pdf.y+24,515,10,muted)+13;
 [['A calls',String(a.count),ink],['B calls',String(b.count),purple],['Final B target',`${exp.allocation}%`,purple]].forEach(([label,value,color],i)=>metric(pdf,40+i*177,pdf.y,161,label,value,color));pdf.y+=96;
 pdf.y=goalTable(pdf,exp.calls,exp.goal,40,pdf.y,515,'All assigned calls / cumulative goal results')+25;
 pdf.text('TRAFFIC PATH',40,pdf.y,8,true,muted);pdf.y+=20;const path=[exp.initial,...exp.decisions.map(d=>d.allocation)];pdf.text(path.map(p=>`${p}%`).join('  ->  '),40,pdf.y,18,true,purple);pdf.y+=28;
 pdf.y=pdf.paragraph(`Final comparison: A ${e.aGoals}/${e.aCount}, B ${e.bGoals}/${e.bCount}. Fisher exact p = ${e.p.toFixed(4)}; required p < ${threshold}, with at least 8 calls per variant. Adaptive calls are excluded from the winner test.`,40,pdf.y,515,10,muted)+18;
 pdf.rect(40,pdf.y,515,63,'#f5f3fb');pdf.paragraph('SANDBOX / Prepared recordings demonstrate rollout behaviour. These results do not measure an edited prompt or establish production uplift. Live trials are required to validate a new prompt.',53,pdf.y+18,489,9,purple,14);
 for(const round of rounds){
  pdf.page(`TRAFFIC DECISIONS / STAGE ${round.index+1}`);pdf.heading(`Stage ${round.index+1}`,`Calls ${round.start+1}-${round.end} / ${round.calls.some(c=>c.phase==='confirmation')?'Final comparison':'Traffic test'}`);
  pdf.text(`Entering traffic target: A ${100-round.allocation}% / B ${round.allocation}%`,40,pdf.y,13,true,purple);pdf.y+=22;
  if(round.calls.some(c=>c.phase==='confirmation'))pdf.y=pdf.paragraph('The final comparison has a fixed 10 A / 10 B assignment across the full group, independent of the traffic target. Individual stages can contain unequal A/B counts.',40,pdf.y,515,9,muted)+12;
  const start=pdf.y,endA=goalTable(pdf,round.calls,exp.goal,40,start,244,'This stage only'),endB=goalTable(pdf,exp.calls.slice(0,round.end),exp.goal,311,start,244,'Cumulative / calls so far');pdf.y=Math.max(endA,endB)+25;
  pdf.text(`CHECKPOINT ${round.index+1}`,40,pdf.y,8,true,muted);pdf.y+=22;pdf.text(round.decision?.title||'Decision pending',40,pdf.y,14,true,purple);pdf.y+=23;pdf.y=pdf.paragraph(round.decision?.reason||'Wait for the stage to finish.',40,pdf.y,515,10,muted)+12;
  pdf.text(`Next B traffic: ${round.allocation}% -> ${round.decision?.allocation??round.allocation}%`,40,pdf.y,12,true);pdf.y+=30;
  const confirmation=exp.calls.slice(0,round.end).filter(c=>c.phase==='confirmation');if(confirmation.length){const ev=significance(confirmation,exp.goal);pdf.rect(40,pdf.y,515,65,'#f6f7fb');pdf.paragraph(`Winner evidence, final comparison only: A ${ev.aGoals}/${ev.aCount}, B ${ev.bGoals}/${ev.bCount}. ${round.index===3?`p = ${ev.p.toFixed(4)}. Threshold: ${threshold}.`:'Winner assessment waits for the complete comparison.'} Earlier traffic-test calls are excluded.`,53,pdf.y+19,489,9,muted,14);}
  callPages(pdf,exp,round);
 }
 pdf.page('METHOD / REPRODUCIBILITY');pdf.heading('How to read this report');
 const method=[
  ['Selected goals',`${goalLabel(exp.goal)}. A call succeeds only when every selected goal is met. Each rate divides matching calls by all calls assigned to that variant in the stated scope, including no answers.`],
  ['Stage and cumulative evidence','Stage-only results contain new calls since the previous checkpoint. Cumulative results contain all earlier completed calls. Traffic targets apply to future assignments; they do not relabel earlier buyers.'],
  ['Decision controls',`Mode: ${exp.automatic?'Automatic':'Review first'}. Maximum B share: ${exp.maximum}%. Growth step: ${exp.rollout?.rampStep??defaultRollout.rampStep} points. Growth ${exp.rollout?.rampUp===false?'off':'on'}; reduction ${exp.rollout?.reduceOnDrop===false?'off':'on'}; detail protection ${exp.rollout?.protectCapture===false?'off':'on'}. Unsupported price or availability promises stop B immediately.`],
  ['Winner evidence','Thirty adaptive pilot buyers and twenty independently assigned confirmation buyers. Two-sided Fisher exact test, declared threshold and minimum sample. Synthetic statistical evidence demonstrates the policy, not an actual prompt improvement.'],
  ['Automatic call evaluation','Recorded transcripts were evaluated by an LLM during preparation; the model is recorded with each verdict. Buyer-supported field quotes, captured requirements, the full transcript and audio are inspectable in the dashboard. Replay consumes no provider credits.'],
  ['Prepared path',`${demoScenarios.find(s=>s.id===exp.scenario)?.name||exp.scenario||'Saved experiment'}. Seed ${exp.seed}. Some paths select alternate prepared conversation styles for the same persona. Recording keys, audio, transcripts and evaluator results always remain aligned.`],
  ['Experiment record',`ID: ${exp.id}. Start: ${exp.startedAt||'not recorded'}. Status: ${exp.status}. Source: ${exp.source||'saved prompt'}. Original prompts and experiment payload are stored in Supabase; report typography uses English labels and standard PDF fonts.`],
 ];
 for(const [title,body]of method){pdf.text(title,40,pdf.y,11,true);pdf.y=pdf.paragraph(body,40,pdf.y+20,515,10,muted)+22;}
 promptPages(pdf,exp.promptA,'Variant A / control');promptPages(pdf,exp.promptB,'Variant B / challenger');
 return pdf.finish(exp.id||'experiment');
}
