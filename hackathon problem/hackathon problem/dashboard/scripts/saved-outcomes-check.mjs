import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {demoScenarios} from '../shared/demo-scenarios.mjs';
import {completeExperiment,preparedExperiment} from '../shared/experiment-run.mjs';

mkdirSync('outputs',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[],restored=[],rotated=[];
let saved,saves=0,providerCalls=0;
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/api/experiments/save',async route=>{saves++;saved=route.request().postDataJSON().payload;await route.fulfill({json:{id:saved.id}});});
await page.route('**/api/prompts/save',route=>route.fulfill({json:{id:'verification'}}));
for(const path of ['prompts/generate','live/**','transcribe'])await page.route(`**/api/${path}`,route=>{providerCalls++;return route.fulfill({status:500,json:{error:'Unexpected live-provider call'}});});
async function finish(){await page.locator('h1').click();await page.keyboard.press('Alt+Enter');await page.getByText('Test complete',{exact:true}).waitFor();await expect(page.locator('.panel-footer')).toContainText('Saved');}
try{
 // Read real Supabase history, but keep all verification writes local/stubbed.
 const response=await fetch('http://127.0.0.1:3000/api/experiments'),history=await response.json();assert.ok(response.ok);assert.equal(history.length,6);assert.deepEqual(history.map(h=>h.scenario),demoScenarios.map(s=>s.id));
 await page.goto('http://127.0.0.1:3000/?seed=8&scenario=growth');
 await page.locator('.sidebar').getByRole('button',{name:'Sample outputs',exact:true}).click();
 await expect(page.locator('h1')).toHaveText('Sample outputs');await expect(page.locator('.saved-outcome-card')).toHaveCount(6);await expect(page.locator('.nav-item').nth(0)).toContainText('Start new A/B');await expect(page.locator('.nav-item').nth(1)).toContainText('Sample outputs');await expect(page.getByRole('button',{name:'Overview',exact:true})).toHaveCount(0);
 const desktop=await page.screenshot({path:'outputs/saved-outcomes-desktop.png',fullPage:true});
 for(const width of [1280,1024,768,390]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.screenshot({path:'outputs/saved-outcomes-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1080});
 const event=page.waitForEvent('download');await page.getByRole('button',{name:`Download PDF: ${history[0].name}`,exact:true}).click();const download=await event;assert.ok(download.suggestedFilename().endsWith('.pdf'));await download.saveAs('outputs/saved-outcome-export.pdf');assert.ok(readFileSync('outputs/saved-outcome-export.pdf','ascii').startsWith('%PDF-1.4'));
 for(const h of history){
  const card=page.locator('.saved-outcome-card').filter({has:page.getByRole('heading',{name:h.name,exact:true})});
  await card.getByRole('button',{name:'Open outcome',exact:true}).click();await page.getByText('Test complete',{exact:true}).waitFor();
  await expect(page.locator('.traffic-stage')).toHaveCount(h.payload.decisions.length);await expect(page.locator('.run-pulse .pulse-progress')).toContainText(String(h.payload.calls.length));await expect(page.locator('.stage-decision').last()).toContainText(h.payload.decisions.at(-1).title);
  await page.getByRole('button',{name:'Inspect stage 1 calls',exact:true}).click();await expect(page.getByRole('region',{name:'Checkpoint 1 evidence',exact:true})).toContainText('The calls behind this decision');
  restored.push(h.scenario);await page.locator('.sidebar').getByRole('button',{name:'Sample outputs',exact:true}).click();await expect(page.locator('.saved-outcome-card')).toHaveCount(6);
 }
 assert.equal(saves,0,'Opening an outcome must be read-only');
 // Old query parameters formerly pinned every run to the winning condition.
 await page.locator('.sidebar').getByRole('button',{name:'Start new A/B',exact:true}).click();
 for(const [index,profile]of demoScenarios.entries()){
  if(index&&await page.getByRole('button',{name:'New experiment',exact:true}).count())await page.getByRole('button',{name:'New experiment',exact:true}).click();
  await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();await page.getByRole('button',{name:'Start experiment',exact:true}).click();await finish();
  const expected=completeExperiment(preparedExperiment(profile.id));assert.equal(saved.scenario,profile.id);assert.deepEqual(saved.decisions.map(d=>d.allocation),expected.decisions.map(d=>d.allocation));rotated.push(profile.id);
  if(index===1){await page.reload();await page.getByRole('heading',{name:'Create your challenger prompt.',exact:true}).waitFor();}
 }
 assert.equal(providerCalls,0);assert.deepEqual(errors,[]);const report={savedOutcomes:history.length,restored,rotationWithLegacyURL:rotated,reloadPreservesRotation:true,restoresAreReadOnly:true,pdf:'passed',mobileOverflow:false,providerCalls,errors};
 writeFileSync('outputs/saved-outcomes-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();}
