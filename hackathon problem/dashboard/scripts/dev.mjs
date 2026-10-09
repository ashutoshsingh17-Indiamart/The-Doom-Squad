import http from 'node:http';
import {Readable} from 'node:stream';
import {statSync} from 'node:fs';
import {createServer} from 'vite';
import {loadEnv} from './env.mjs';
const vite=await createServer({server:{middlewareMode:true},appType:'spa'});
const env=loadEnv();
const server=http.createServer(async(req,res)=>{
  if(!req.url.startsWith('/api/'))return vite.middlewares(req,res);
  try {
    const options={method:req.method,headers:req.headers};
    if(!['GET','HEAD'].includes(req.method)){options.body=Readable.toWeb(req);options.duplex='half';}
    const workerFile=new URL('../worker/index.js',import.meta.url);
    const {default:worker}=await import(`${workerFile.href}?v=${statSync(workerFile).mtimeMs}`);
    const response=await worker.fetch(new Request(`http://${req.headers.host}${req.url}`,options),env);
    res.writeHead(response.status,Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({error:'Local API failed.'}));}
});
server.listen(3000,'127.0.0.1',()=>console.log('VoiceOps local preview: http://127.0.0.1:3000'));
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?'Port 3000 is in use. Stop the existing server before restarting.':err.message);process.exit(1);});
