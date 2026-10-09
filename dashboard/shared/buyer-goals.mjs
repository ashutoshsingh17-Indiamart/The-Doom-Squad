export const buyerGoals=[
 {id:'confirm_need',name:'Confirm requirement',description:'Buyer confirms they still need the product.',short:'Need confirmed'},
 {id:'capture_specs',name:'Capture specifications',description:'Both product specifications are recorded.',short:'Specifications captured'},
 {id:'capture_quantity',name:'Collect quantity',description:'The required quantity is recorded.',short:'Quantity collected'},
];
export const defaultGoals=buyerGoals.map(g=>g.id);
export function callMeetsGoal(call,id){
 if(call.guardrails?.length)return false;
 if(!['Buyer enriched','Partial requirement','Callback fixed'].includes(call.disposition))return false;
 if(id==='confirm_need')return ['Buyer enriched','Partial requirement','Callback fixed'].includes(call.disposition);
 if(id==='capture_specs')return call.product.specs.every(s=>!!call.extracted?.[s.key]);
 if(id==='capture_quantity')return !!call.extracted?.Quantity;
 return false;
}
export function callMeetsGoals(call,selection='Buyer enriched'){
 if(typeof selection==='string')return call.disposition===selection&&!call.guardrails?.length;
 return selection.length>0&&selection.every(id=>buyerGoals.some(g=>g.id===id)&&callMeetsGoal(call,id));
}
export function goalLabel(selection){return Array.isArray(selection)?selection.length===3?'Complete requirements':selection.map(id=>buyerGoals.find(g=>g.id===id)?.name||'').filter(Boolean).join(' + '):selection;}
export const defaultRollout={rampUp:true,reduceOnDrop:true,protectCapture:true,rampStep:20,evidence:'standard'};
