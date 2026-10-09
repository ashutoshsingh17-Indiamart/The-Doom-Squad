import {mkdirSync,existsSync,readFileSync,writeFileSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadEnv} from './env.mjs';
import {personas,scriptedCall} from '../shared/domain.mjs';
import {recordings as previousRecordings} from '../shared/recording-manifest.mjs';
const env=loadEnv();if(!env.SARVAM_API_KEY)throw new Error('SARVAM_API_KEY is missing');
mkdirSync('work/sarvam-cache',{recursive:true});mkdirSync('public/audio',{recursive:true});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function decode(wav){
 if(wav.toString('ascii',0,4)!=='RIFF')throw new Error('Sarvam returned non-WAV audio');
 let fmt,pcm;for(let i=12;i+8<=wav.length;){const size=wav.readUInt32LE(i+4),key=wav.toString('ascii',i,i+4);if(key==='fmt ')fmt=wav.subarray(i+8,i+8+size);if(key==='data')pcm=wav.subarray(i+8,i+8+size);i+=8+size+(size%2);}
 if(!fmt||!pcm||fmt.readUInt16LE(0)!==1||fmt.readUInt16LE(14)!==16)throw new Error('Expected 16-bit PCM WAV');return {fmt,pcm};
}
function encode(fmt,pcm){const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);fmt.copy(header,20,0,16);header.write('data',36);header.writeUInt32LE(pcm.length,40);return Buffer.concat([header,pcm]);}
function ring(){const rate=22050,pcm=Buffer.alloc(rate*4*2),fmt=Buffer.alloc(16);fmt.writeUInt16LE(1,0);fmt.writeUInt16LE(1,2);fmt.writeUInt32LE(rate,4);fmt.writeUInt32LE(rate*2,8);fmt.writeUInt16LE(2,12);fmt.writeUInt16LE(16,14);for(let i=0;i<rate*4;i++){const t=i/rate,active=t%2<.7;pcm.writeInt16LE(active?Math.round(2200*(Math.sin(2*Math.PI*440*t)+Math.sin(2*Math.PI*480*t))):0,i*2);}return encode(fmt,pcm);}
let requests=0,characters=0,nextRequest=0;
const inflight=new Map();
async function speech(text,speaker){
 const key=createHash('sha256').update(JSON.stringify({text,speaker,model:'bulbul:v3',pace:1})).digest('hex'),path=`work/sarvam-cache/${key}.wav`;
 if(existsSync(path))return readFileSync(path);
 if(inflight.has(key))return inflight.get(key);
 const promise=(async()=>{for(let attempt=0;attempt<12;attempt++){
 const reserved=Math.max(Date.now(),nextRequest);nextRequest=reserved+3300;await sleep(Math.max(0,reserved-Date.now()));
 const response=await fetch('https://api.sarvam.ai/text-to-speech',{method:'POST',headers:{'api-subscription-key':env.SARVAM_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({text,language_code:'en-IN',model:'bulbul:v3',speaker,output_audio_codec:'wav',speech_sample_rate:22050,pace:1,temperature:.65}),signal:AbortSignal.timeout(90000)});
 if(response.status===429){const error=await response.json().catch(()=>({}));const message=String(error.error?.message||error.message||'Rate limit').slice(0,180);console.log(`Sarvam throttled: ${message}`);if(/credit|balance|quota.*exhaust/i.test(message))throw new Error('Sarvam credits exhausted; completed clips are cached.');nextRequest=Math.max(nextRequest,Date.now()+15000);await sleep(15000);continue;}
 if(!response.ok)throw new Error(`Sarvam HTTP ${response.status}; preparation stopped with the completed clips cached.`);
 const data=await response.json();if(!data.audios?.[0])throw new Error('No Sarvam audio');const bytes=Buffer.from(data.audios[0],'base64');decode(bytes);writeFileSync(path,bytes);requests++;characters+=text.length;return bytes;
 }throw new Error('Sarvam rate limit; resume preparation later.');})();inflight.set(key,promise);try{return await promise;}finally{inflight.delete(key);}
}
const manifest={...previousRecordings};const path='shared/recording-manifest.mjs';
const calls=personas.flatMap(p=>[scriptedCall(p.id,'A'),scriptedCall(p.id,'B'),scriptedCall(p.id,'B','regression')]);
// Identical scenarios share clips, but retain a recording for every buyer/variant.
const unique=[...new Map(calls.map(c=>[c.key,c])).values()];let cursor=0,completed=0;
async function worker(){while(cursor<unique.length){const call=unique[cursor++];const signature=createHash('sha256').update(JSON.stringify({turns:call.turns,buyer:call.persona.voice,agent:call.persona.agentVoice,version:2})).digest('hex');const file=`public/audio/${call.key}.wav`,meta=`work/sarvam-cache/${call.key}.json`;let bytes;
 if(existsSync(file)&&existsSync(meta)&&JSON.parse(readFileSync(meta,'utf8')).signature===signature)bytes=readFileSync(file);
 else if(!call.turns.length)bytes=ring();
 else{const clips=[];let fmt;for(const turn of call.turns){const part=decode(await speech(turn.text,turn.speaker==='buyer'?call.persona.voice:call.persona.agentVoice));if(fmt&&!part.fmt.subarray(0,16).equals(fmt.subarray(0,16)))throw new Error('Mismatched audio formats');fmt=part.fmt;clips.push(part.pcm,Buffer.alloc(Math.round(fmt.readUInt32LE(8)*.24)));}bytes=encode(fmt,Buffer.concat(clips));}
 writeFileSync(file,bytes);writeFileSync(meta,JSON.stringify({signature}));const decoded=decode(bytes);manifest[call.key]={duration:Math.round(decoded.pcm.length/decoded.fmt.readUInt32LE(8)),provider:call.turns.length?'Sarvam Bulbul v3':'Unanswered call · ringback',buyerVoice:call.persona.voice,agentVoice:call.persona.agentVoice};completed++;writeFileSync(path+'.tmp',`export const recordings = ${JSON.stringify(manifest,null,2)};\n`);renameSync(path+'.tmp',path);console.log(`Prepared ${completed}/${unique.length}: ${call.key} · ${manifest[call.key].duration}s`);
 }}
await Promise.all([worker(),worker()]);console.log(JSON.stringify({recordings:completed,newSpeechRequests:requests,charactersSynthesized:characters,playbackUsesCredits:false}));
