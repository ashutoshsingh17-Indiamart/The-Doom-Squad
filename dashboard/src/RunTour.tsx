import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowDown,ArrowUp} from 'lucide-react';
import './run-tour.css';

const keysThatScroll=['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '];
export function reveal(id:string){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.getElementById(id)?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
}

// Guides the viewer through a run they just started: the activity screen (with its live B traffic chart)
// while calls run, then the decisions when the test ends. Scrolling by hand hands control back.
export function useRunTour(runId:string|undefined,active:boolean,status:string|undefined){
 const follow=useRef(false),[showJump,setShowJump]=useState(false);
 useEffect(()=>{
  if(!active)return;
  follow.current=true;setShowJump(false);
  const stop=(e:Event)=>{if(e instanceof KeyboardEvent&&!keysThatScroll.includes(e.key))return;follow.current=false;};
  addEventListener('wheel',stop,{passive:true});addEventListener('touchmove',stop,{passive:true});addEventListener('keydown',stop);
  const timer=setTimeout(()=>{if(follow.current)reveal('experiment-activity');},150);
  return ()=>{clearTimeout(timer);removeEventListener('wheel',stop);removeEventListener('touchmove',stop);removeEventListener('keydown',stop);};
 },[runId,active]);
 const ended=status==='completed'||status==='stopped';
 useEffect(()=>{
  if(!active||!ended)return;
  const timer=setTimeout(()=>{if(follow.current)reveal('traffic-decisions');setShowJump(true);},400);
  return ()=>clearTimeout(timer);
 },[ended,active]);
 return {showJump,hideJump:()=>setShowJump(false)};
}

export function ResultsJump({onDone}:{onDone:()=>void}){
 const [outcomeVisible,setOutcomeVisible]=useState(false);
 useEffect(()=>{
  const target=document.getElementById('experiment-outcome');if(!target)return;
  const observer=new IntersectionObserver(([entry])=>setOutcomeVisible(entry.isIntersecting),{threshold:.25});
  observer.observe(target);return ()=>observer.disconnect();
 },[]);
 if(outcomeVisible)return null;
 // Portal to body: the animated run stage keeps a transform, which would pin a fixed button to the stage.
 return createPortal(<button className="results-jump" onClick={()=>{reveal('experiment-outcome');onDone();}}>See results &amp; recommendation<ArrowDown size={17}/></button>,document.body);
}

export function DecisionsChip({count}:{count:number}){
 return <button className="decisions-chip" onClick={()=>reveal('traffic-decisions')}><ArrowUp size={14}/>View B scale-up / scale-down decisions<span>{count}</span></button>;
}
