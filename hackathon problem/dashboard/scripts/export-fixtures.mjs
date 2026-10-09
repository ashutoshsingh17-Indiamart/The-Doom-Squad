import {writeFileSync,mkdirSync} from 'node:fs';
import {personas,fixture} from '../shared/domain.mjs';
mkdirSync('work',{recursive:true});
const calls=personas.flatMap(p=>[fixture(p.id,'A'),fixture(p.id,'B'),fixture(p.id,'B','regression')]);
writeFileSync('work/recordings.json',JSON.stringify(calls.map(c=>({id:c.audio.split('/').pop().replace('.wav',''),turns:c.turns})),null,2));
console.log(`Prepared ${calls.length} scripted recording references for ${personas.length} buyers.`);
