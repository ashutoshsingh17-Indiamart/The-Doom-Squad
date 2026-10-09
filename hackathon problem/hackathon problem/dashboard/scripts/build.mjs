import {build} from 'esbuild';
import {mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/server',{recursive:true});
await build({entryPoints:['worker/index.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022'});
mkdirSync('dist/.openai',{recursive:true});copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built frontend and portable API worker.');
