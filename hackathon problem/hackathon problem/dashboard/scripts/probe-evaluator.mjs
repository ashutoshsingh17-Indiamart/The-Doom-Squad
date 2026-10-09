import {scriptedCall} from '../shared/domain.mjs';
const model=process.argv[2]||'apodex/apodex-1.1-mini:free';
const call=scriptedCall('p01','A');const started=Date.now();
const response=await fetch('http://127.0.0.1:3000/api/evaluate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model,calls:[{id:call.key,productId:call.product.id,turns:call.turns}]})});
const data=await response.json();console.log(JSON.stringify({model,status:response.status,seconds:(Date.now()-started)/1000,data},null,2));
