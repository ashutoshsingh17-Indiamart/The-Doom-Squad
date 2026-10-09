import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
const response=await fetch('http://127.0.0.1:3000/api/live/start',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({productId:'tshirts',language:'en-IN',voice:true})});
const data=await response.json();assert.ok(response.ok,data.error);assert.ok(data.audio,data.audioError||'No Sarvam audio returned');
const bytes=Buffer.from(data.audio,'base64');assert.ok(bytes.length>1000);mkdirSync('work',{recursive:true});writeFileSync('work/live-voice-check.wav',bytes);
const form=new FormData();form.append('file',new Blob([bytes],{type:'audio/wav'}),'agent.wav');form.append('language','en-IN');
const transcriptResponse=await fetch('http://127.0.0.1:3000/api/transcribe',{method:'POST',body:form});const transcribed=await transcriptResponse.json();assert.ok(transcriptResponse.ok,transcribed.error);assert.ok(transcribed.transcript?.length>10);
console.log('Sarvam speech synthesis and transcription passed. One short sample used.');
