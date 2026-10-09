import {useEffect,useState} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {ArrowRight,BookOpen,Download,FileText,List,Route} from 'lucide-react';
import readme from '../../README.md?raw';
import skills from '../../skills.md?raw';
import technical from '../README.md?raw';
import artifacts from '../../sample-outputs/README.md?raw';
import workflow from '../../docs/visuals/experiment-loop.svg';
import evidence from '../../docs/visuals/evidence-layers.svg';
import architecture from '../../docs/visuals/platform-architecture.svg';
import schema from '../supabase/schema.sql?url';
import environmentTemplate from '../../.env.example?url';
import './workspace-guide.css';

type Guide='readme'|'skills'|'technical'|'artifacts';
const documents={
 readme:{text:readme,path:'README.md',label:'Client walkthrough',detail:'From your first challenger to the evidence behind a rollout.'},
 skills:{text:skills,path:'skills.md',label:'Product design & engineering',detail:'The decisions, capabilities and tools behind VoiceOps.'},
 technical:{text:technical,path:'dashboard/README.md',label:'Technical setup guide',detail:'Configure, run and verify your own workspace.'},
 artifacts:{text:artifacts,path:'sample-outputs/README.md',label:'Report artifacts',detail:'Download complete reports and matching audit data.'},
};
const visuals:Record<string,string>={'docs/visuals/experiment-loop.svg':workflow,'docs/visuals/evidence-layers.svg':evidence,'docs/visuals/platform-architecture.svg':architecture};
const assets=import.meta.glob<string>('../../sample-outputs/*.{pdf,json}',{eager:true,query:'?url',import:'default'});
const downloads:Record<string,string>={'.env.example':environmentTemplate,'dashboard/supabase/schema.sql':schema,...Object.fromEntries(Object.entries(assets).map(([path,url])=>[path.replace('../../',''),url]))};
const slug=(text:string)=>`guide-${text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
function sourcePath(href:string,path:string){return new URL(href,`https://voiceops.invalid/${path}`).pathname.slice(1);}
function scrollToSection(id:string){document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}

export function WorkspaceGuide({kind,onNavigate}:{kind:'readme'|'skills';onNavigate:(destination:string)=>void}){
 const [current,setCurrent]=useState<Guide>(kind),[active,setActive]=useState('');
 const doc=documents[current],sections=doc.text.split('\n').filter(line=>line.startsWith('## ')).map(line=>line.slice(3).trim()),minutes=Math.max(1,Math.ceil(doc.text.split(/\s+/).length/220));
 useEffect(()=>{setCurrent(kind);},[kind]);
 useEffect(()=>{
  setActive(slug(sections[0]||''));
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting);if(visible.length)setActive(visible[0].target.id);},{rootMargin:'-15% 0px -60% 0px'});
  document.querySelectorAll('.guide-article h2[id]').forEach(el=>observer.observe(el));
  return()=>observer.disconnect();
 },[current]);
 function openDocument(next:Guide){setCurrent(next);window.scrollTo({top:0,behavior:'instant'});}
 function download(){const url=URL.createObjectURL(new Blob([doc.text],{type:'text/markdown;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=doc.path.split('/').at(-1)!;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <div className="workspace-guide">
  <div className="guide-intro"><span className="guide-icon">{kind==='readme'?<BookOpen size={25}/>:<Route size={25}/>}</span><div><span className="stage-kicker">{kind==='readme'?'GET TO KNOW VOICEOPS':'HOW WE BUILT VOICEOPS'}</span><h2>{doc.label}</h2><p>{doc.detail}</p></div><button className="button secondary small" onClick={download}><Download size={15}/>Download Markdown</button></div>
  <div className="guide-layout"><aside className="guide-toc" aria-label="Guide contents"><div className="guide-toc-heading"><List size={15}/><strong>IN THIS GUIDE</strong></div><div className="guide-meta"><FileText size={13}/>{doc.path}<span>{minutes} min read</span></div><nav>{sections.map(section=><button key={section} className={active===slug(section)?'active':''} onClick={()=>{setActive(slug(section));scrollToSection(slug(section));}}>{section}</button>)}</nav>{current!==kind&&<button className="text-button guide-return" onClick={()=>openDocument(kind)}>Back to {kind==='readme'?'README':'skills.md'}</button>}<div className="guide-next"><strong>Experience it yourself</strong><p>Open a completed report, or create your own challenger.</p><button className="text-button" onClick={()=>onNavigate('saved')}>Explore sample outputs<ArrowRight size={14}/></button></div></aside>
  <article className="panel guide-article"><Markdown remarkPlugins={[remarkGfm]} components={{
   h1:({children})=><h2 className="guide-document-title">{children}</h2>,
   h2:({children,node})=>{const text=node?.children.map(n=>'value' in n?n.value:'').join('')||String(children);return <h2 id={slug(text)}>{children}</h2>;},
   table:({children})=><div className="guide-table-scroll" tabIndex={0} aria-label="Guide comparison table"><table>{children}</table></div>,
   img:({src,alt})=><img src={visuals[sourcePath(String(src||''),doc.path)]||src} alt={alt||''} loading="lazy" className="guide-graphic"/>,
   a:({href='',children})=>{
    if(href.startsWith('#/'))return <a href={href} onClick={e=>{e.preventDefault();onNavigate({'#/samples':'saved','#/start':'experiments','#/cohort':'cohort','#/team':'team'}[href]||'experiments');}}>{children}</a>;
    if(href.startsWith('#'))return <a href={href} onClick={e=>{e.preventDefault();scrollToSection(slug(href.slice(1)));}}>{children}</a>;
    if(/^https?:/.test(href))return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
    const path=sourcePath(href,doc.path),next=(Object.keys(documents) as Guide[]).find(id=>documents[id].path===path);
    if(next)return <a href={href} onClick={e=>{e.preventDefault();if(next==='readme'||next==='skills')onNavigate(next);else openDocument(next);}}>{children}</a>;
    return downloads[path]?<a href={downloads[path]} download={path.split('/').at(-1)}>{children}</a>:<span>{children}</span>;
   },
  }}>{doc.text}</Markdown><div className="guide-end"><span><strong>Ready to explore?</strong><small>Your next prompt improvement starts with one change.</small></span><button className="button primary" onClick={()=>onNavigate('experiments')}>Start new A/B<ArrowRight size={15}/></button></div></article></div>
 </div>;
}
