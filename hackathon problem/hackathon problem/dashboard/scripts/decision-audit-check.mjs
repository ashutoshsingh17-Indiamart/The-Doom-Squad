import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {goalComparison,checkpointCalls} from '../shared/decision-audit.mjs';
mkdirSync('outputs',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
let saved;
// Exercise real UI state without adding verification experiments to the workspace.
await page.route('**/api/experiments/save',async route=>{saved=route.request().postDataJSON().payload;await route.fulfill({json:{id:saved.id}});});
await page.route('**/api/prompts/save',route=>route.fulfill({json:{id:'verification'}}));
async function finish(){await page.locator('h1').click();await page.keyboard.press('Alt+Enter');await page.getByText('Test complete',{exact:true}).waitFor();await expect(page.locator('.panel-footer')).toContainText('Saved');}
try{
 await page.goto('http://127.0.0.1:3000/?pin=1&seed=8');
 await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();
 await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();
 await page.getByRole('button',{name:'Start experiment',exact:true}).click();await finish();
 assert.equal(saved.calls.length,50);
 await expect(page.locator('.assignment-accounting')).toHaveCount(0);
 await expect(page.locator('.traffic-stage')).toHaveCount(4);
 await page.locator('.audit-journey').screenshot({path:'outputs/decision-checkpoints.png',animations:'disabled'});
 for(let i=0;i<4;i++){
  const card=page.locator('.traffic-stage').nth(i);
  for(const [selector,scope]of [['.stage-evidence','round'],['.stage-cumulative','all']]){
   const rows=goalComparison(checkpointCalls(saved.calls,saved.decisions,i,scope),saved.goal);
   for(const [j,row]of rows.entries()){
    const tr=card.locator(`${selector} .checkpoint-goals tbody tr`).nth(j);
    await expect(tr.locator('td').nth(0)).toContainText(`${row.A.met}/${row.A.total}`);
    await expect(tr.locator('td').nth(1)).toContainText(`${row.B.met}/${row.B.total}`);
   }
  }
  await page.getByRole('button',{name:`Inspect checkpoint ${i+1}`,exact:true}).click();
  const region=page.getByRole('region',{name:`Checkpoint ${i+1} evidence`,exact:true});
  await expect(region.locator('.audit-call-table tbody tr')).toHaveCount(saved.decisions[i].calls);
  for(const title of ['Confirm requirement','Capture specifications','Collect quantity','Duration'])await expect(region.locator('.audit-call-table').getByRole('columnheader',{name:title,exact:true})).toBeVisible();
  await region.getByRole('group',{name:'Evidence scope'}).getByRole('button',{name:'This round',exact:true}).click();
  await expect(region.locator('.audit-call-table tbody tr')).toHaveCount(i<2?15:10);
  await region.getByRole('group',{name:'Evidence variant'}).getByRole('button',{name:'Variant B',exact:true}).click();
  await expect(region.locator('.audit-call-table tbody tr')).toHaveCount([3,6,4,6][i]);
 }
 const region=page.getByRole('region',{name:'Checkpoint 4 evidence'});
 await region.getByRole('group',{name:'Evidence scope'}).getByRole('button',{name:'Final comparison',exact:true}).click();
 await region.getByRole('group',{name:'Evidence variant'}).getByRole('button',{name:'Both variants',exact:true}).click();
 await expect(region.locator('.audit-call-table tbody tr')).toHaveCount(20);
 await expect(region.locator('.combined-goals')).toContainText('1/10');await expect(region.locator('.combined-goals')).toContainText('7/10');
 await region.screenshot({path:'outputs/decision-evidence.png'});
 const firstName=saved.calls.find(c=>c.phase==='confirmation').persona.name;
 await region.getByRole('button',{name:`View ${firstName} call`,exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Call details'})).toContainText(firstName);
 await page.keyboard.press('Escape');await expect(region).toBeVisible();
 await expect(region.getByRole('button',{name:`View ${firstName} call`,exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Show activity',exact:true}).click();
 await expect(page.locator('.round-entry')).toHaveCount(4);await expect(page.locator('.round-entry .audit-call-table tbody tr')).toHaveCount(50);
 const numbers=await page.locator('.round-entry .call-sequence').allTextContents();assert.deepEqual(numbers,Array.from({length:50},(_,i)=>`#${i+1}`));
 await page.locator('.round-entry').first().screenshot({path:'outputs/decision-round-log.png'});
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export PDF',exact:true}).click();const file=await event;assert.ok(file.suggestedFilename().endsWith('.pdf'));await file.saveAs('outputs/decision-audit-report.pdf');
 const report=readFileSync('outputs/decision-audit-report.pdf','ascii');assert.ok(report.startsWith('%PDF-1.4'));assert.ok(report.includes('This stage only'));assert.ok(report.includes('Cumulative / calls so far'));assert.ok(report.includes('31 calls'));assert.ok(report.includes('19 calls'));assert.ok(report.includes('Original call order'));
 // The experiment report retains the same drill-down, including recordings.
 await page.getByRole('button',{name:'Inspect checkpoint 1',exact:true}).click();
 await expect(page.getByRole('region',{name:'Checkpoint 1 evidence'}).locator('.audit-call-table tbody tr')).toHaveCount(15);
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Inspect checkpoint 4',exact:true}).click();
 await page.getByRole('region',{name:'Checkpoint 4 evidence'}).screenshot({path:'outputs/decision-evidence-mobile.png'});
 const overflow=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,wide:[...document.querySelectorAll('main *')].filter(el=>el.getBoundingClientRect().width>innerWidth).slice(0,12).map(el=>({class:el.className,width:el.getBoundingClientRect().width}))}));
 if(overflow.overflow)console.log(JSON.stringify(overflow));assert.equal(overflow.overflow,false);
 assert.equal(errors.length,0);
 console.log(JSON.stringify({checkpoints:4,callsAudited:50,roundBCounts:[3,6,4,6],finalComparison:'A 1/10 vs B 7/10',mobileOverflow:false,errors,providerCalls:0}));
}finally{await browser.close();}
