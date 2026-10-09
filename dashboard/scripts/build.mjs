import {build} from 'esbuild';
import {mkdirSync,copyFileSync,writeFileSync} from 'node:fs';
mkdirSync('dist/server',{recursive:true});
await build({entryPoints:['worker/index.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022'});
mkdirSync('dist/.openai',{recursive:true});copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
// Keep the bundled server code out of the public static assets on Cloudflare.
writeFileSync('dist/.assetsignore','server\n.openai\n');
console.log('Built frontend and portable API worker.');
