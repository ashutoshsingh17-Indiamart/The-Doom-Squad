import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {demoScenarios} from '../shared/demo-scenarios.mjs';
import {completeExperiment,preparedExperiment} from '../shared/experiment-run.mjs';

mkdirSync('outputs',{recursive:true});mkdirSync('../sample-outputs/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],results=[];
let saved,providerCalls=0;
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/api/experiments/save',async route=>{saved=route.request().postDataJSON().payload;await route.fulfill({json:{id:saved.id}});});
await page.route('**/api/prompts/save',route=>route.fulfill({json:{id:'verification'}}));
for(const path of ['prompts/generate','live','speech','transcribe'])await page.route(`**/api/${path}`,route=>{providerCalls++;return route.fulfill({status:500,json:{error:'Provider calls must not occur in replay verification'}});});
async function overflow(){return page.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth,cells:[...document.querySelectorAll('.traffic-stage .checkpoint-goals td,.traffic-stage .checkpoint-goals th')].some(el=>{const cell=el.getBoundingClientRect(),card=el.closest('.traffic-stage').getBoundingClientRect();return cell.left<card.left-1||cell.right>card.right+1;})}));}
try{
 await page.goto('http://127.0.0.1:3000/');
 for(const [index,profile]of demoScenarios.entries()){
  if(index)await page.getByRole('button',{name:'New experiment',exact:true}).click();
  await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();await page.getByRole('button',{name:'Start experiment',exact:true}).click();
  await page.locator('h1').click();await page.keyboard.press('Alt+Enter');await page.getByText('Test complete',{exact:true}).waitFor();await expect(page.locator('.panel-footer')).toContainText('Saved');
  const expected=completeExperiment(preparedExperiment(profile.id));assert.equal(saved.scenario,profile.id);assert.equal(saved.seed,profile.seed);assert.deepEqual(saved.decisions.map(d=>d.allocation),expected.decisions.map(d=>d.allocation));assert.equal(saved.calls.length,expected.calls.length);
  await expect(page.locator('.traffic-stage')).toHaveCount(expected.decisions.length);await expect(page.locator('.stage-share').first()).toHaveText('20%to B');
  const last=page.locator('.stage-decision').last();await expect(last).toContainText(expected.decisions.at(-1).title);
  if(profile.id==='reverse')await expect(page.locator('.result-hero')).toContainText('Variant A wins');
  if(profile.id==='fade')await expect(page.locator('.result-hero')).toContainText('Hold B at 20%');
  if(profile.id==='late-safety')await expect(page.locator('.result-hero')).toContainText('B stopped');
  assert.deepEqual(await overflow(),{page:false,cells:false});
  await page.locator('.traffic-stage').first().screenshot({path:`../sample-outputs/screenshots/${profile.id}-stage-1.png`,animations:'disabled'});
  if(profile.id==='growth'){
   await page.locator('.traffic-stage').nth(1).screenshot({path:'../sample-outputs/screenshots/stage-2-desktop.png',animations:'disabled'});
   for(const width of [1280,1024,768,390]){await page.setViewportSize({width,height:844});assert.deepEqual(await overflow(),{page:false,cells:false});}
   await page.locator('.traffic-stage').nth(1).screenshot({path:'../sample-outputs/screenshots/stage-2-mobile.png',animations:'disabled'});await page.setViewportSize({width:1440,height:1000});
   const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export PDF',exact:true}).click();const file=await download;assert.ok(file.suggestedFilename().endsWith('.pdf'));await file.saveAs('outputs/ui-export.pdf');assert.ok(readFileSync('outputs/ui-export.pdf','ascii').startsWith('%PDF-1.4'));
  }
  results.push({path:profile.id,traffic:[saved.initial,...saved.decisions.map(d=>d.allocation)],calls:saved.calls.length});
 }
 // A pinned path does not advance the rotation and remains reproducible.
 await page.goto('http://127.0.0.1:3000/?pin=1&scenario=fade');await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();await page.getByRole('button',{name:'Start experiment',exact:true}).click();await page.locator('h1').click();await page.keyboard.press('Alt+Enter');await page.getByText('Test complete',{exact:true}).waitFor();await expect(page.locator('.panel-footer')).toContainText('Saved');assert.equal(saved.scenario,'fade');assert.equal(saved.seed,10);
 assert.equal(providerCalls,0);assert.deepEqual(errors,[]);console.log(JSON.stringify({scenarios:results,pinnedPath:'fade',widthsChecked:[1440,1280,1024,768,390],providerCalls,errors}));
}finally{await browser.close();}
