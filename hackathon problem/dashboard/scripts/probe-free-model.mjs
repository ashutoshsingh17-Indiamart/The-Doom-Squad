import {loadEnv} from './env.mjs';
const env=loadEnv();
for(const model of ['openrouter/free']){
  const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({model,messages:[{role:'user',content:'Return only a JSON object with a greeting field.'}],max_tokens:1200,reasoning:{effort:"minimal",exclude:true}}),signal:AbortSignal.timeout(45000)});
  const data=await response.json();const safe=String(data.error?.message||'').replaceAll(env.OPENROUTER_API_KEY,'[redacted]');
  console.log(JSON.stringify({requested:model,status:response.status,model:data.model,error:safe,finish:data.choices?.[0]?.finish_reason,usage:data.usage,content:data.choices?.[0]?.message?.content}));
  if(response.ok && data.choices?.[0]?.message?.content)break;
}
