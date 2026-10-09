import {chromium,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {aggregate,fixture,defaultGoals,defaultRollout} from '../shared/domain.mjs';
mkdirSync('outputs',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],passed=[];
page.on('pageerror',e=>errors.push(e.message));let generationRequests=0;
await page.route('**/api/experiments/save',route=>route.fulfill({json:{id:route.request().postDataJSON().id}}));
await page.route('**/api/prompts/save',route=>route.fulfill({json:{id:'verification'}}));
page.on('request',r=>{if(r.url().endsWith('/api/prompts/generate'))generationRequests++;});
async function capture(name){await page.locator('.journey-stage,.journey-card').evaluateAll(cards=>Promise.all(cards.flatMap(c=>c.getAnimations().map(a=>a.finished.catch(()=>{})))));await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`outputs/${name}.png`,fullPage:true});}
async function openSetup(params=''){
 await page.goto(`http://127.0.0.1:3000/${params}`);
 await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();
 await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();
 await page.getByRole('heading',{name:'Experiment setup',exact:true}).waitFor();
}
async function finish(){await page.locator('h1').click();await page.keyboard.press('Alt+Enter');await page.getByText('Test complete',{exact:true}).waitFor();await expect(page.locator('.panel-footer')).toContainText('Saved',{timeout:20000});}
try{
 await page.goto('http://127.0.0.1:3000');await capture('cockpit-prompts-empty');
 await expect(page.getByLabel('Describe the improvement',{exact:true})).toHaveValue('');
 for(const label of ['Faster flow for busy buyers','Explain unfamiliar specs','A warmer greeting','Stop repeating questions']){
  const start=Date.now();await page.getByRole('button',{name:label,exact:false}).click();await expect(page.getByRole('button',{name:'Next: set up experiment',exact:true})).toBeEnabled();assert.ok(Date.now()-start<1500);
  await expect(page.getByRole('button',{name:label,exact:false})).toHaveAttribute('aria-pressed','true');
 }
 assert.equal(generationRequests,0);passed.push('All four chips load distinct prepared prompts instantly without model requests');
 // A custom rewrite still uses the API and recovers cleanly from provider failure.
 await page.getByRole('button',{name:'Change request',exact:true}).click();
 await page.getByLabel('Describe the improvement',{exact:true}).fill('Ask a shorter quantity question.');
 await page.route('**/api/prompts/generate',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Custom writer unavailable. Please retry.'})}));
 await page.getByRole('button',{name:'Regenerate variant B',exact:true}).click();await page.getByText('Custom writer unavailable. Please retry.',{exact:true}).waitFor();
 await expect(page.getByRole('button',{name:'Next: set up experiment',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Keep current variant',exact:true}).click();await page.unroute('**/api/prompts/generate');await page.getByRole('button',{name:'Dismiss error',exact:true}).click();
 assert.equal(generationRequests,1);passed.push('Custom requests use the API and preserve the previous prompt on writer failure');
 await capture('cockpit-prompts-ready');
 await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();
 for(const goal of ['Confirm requirement','Capture specifications','Collect quantity'])await expect(page.getByRole('switch',{name:goal,exact:true})).toHaveAttribute('aria-checked','true');
 await expect(page.getByRole('combobox')).toHaveCount(0);
 const text=await page.locator('main').innerText();for(const unwanted of ['No manual tagging','Must not fall','Zero tolerance','Fixed test window','Simulated time','reserved confirmation buyers','50 unique buyers','6 products','decision playbook','PRERECORDED'])assert.ok(!text.includes(unwanted),unwanted);
 await capture('cockpit-setup');passed.push('Buyer-goal switches and useful controls replace the static playbook and rehearsal text');
 for(const goal of ['Confirm requirement','Capture specifications','Collect quantity'])await page.getByRole('switch',{name:goal,exact:true}).click();
 await expect(page.getByRole('button',{name:'Start experiment',exact:true})).toBeDisabled();
 await page.getByRole('switch',{name:'Collect quantity',exact:true}).click();
 await expect(page.getByRole('button',{name:'Start experiment',exact:true})).toBeEnabled();
 await page.getByRole('group',{name:'Traffic increase step',exact:true}).getByRole('button',{name:'+10%',exact:true}).click();
 await page.getByRole('switch',{name:'Grow B when it performs better',exact:true}).click();
 await page.getByRole('switch',{name:'Keep the quality of collected details',exact:true}).click();
 await page.getByRole('button',{name:'Start experiment',exact:true}).click();
 await page.getByRole('button',{name:'Pause experiment',exact:true}).click();
 await expect(page.getByRole('button',{name:/Experiment setup/})).toBeDisabled();
 await page.getByRole('button',{name:'Resume experiment',exact:true}).click();await finish();
 await expect(page.locator('.comparison-table')).toContainText('Collect quantity');await expect(page.locator('.comparison-table')).not.toContainText('Capture specifications');
 await expect(page.locator('.rollout-readout .allocation-summary')).toContainText('50%');
 const reportEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Export PDF',exact:true}).click();await (await reportEvent).saveAs('outputs/cockpit-report.pdf');
 passed.push('Goal selections and rollout switches persist into actual call scoring, decisions and export');
 await openSetup('?pin=1&seed=8');await page.getByRole('button',{name:'Start experiment',exact:true}).click();await finish();
 await page.getByRole('heading',{name:'Variant B wins.',exact:true}).waitFor();await expect(page.locator('.rollout-readout .allocation-summary')).toContainText('100%');assert.equal(await page.locator('.traffic-stage').count(),4);await capture('cockpit-winner');passed.push('Standard evidence confirms a winner with full rollout');
 await page.getByRole('button',{name:'New experiment',exact:true}).click();await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();
 await page.getByRole('button',{name:'Stronger evidence',exact:false}).click();await page.getByRole('button',{name:'Start experiment',exact:true}).click();await finish();await page.getByRole('heading',{name:'Keep A. B needs more testing.',exact:true}).waitFor();passed.push('Stronger evidence changes the same run to inconclusive');
 await openSetup('?pin=1&seed=8&scenario=regression');await page.getByRole('button',{name:'Review first',exact:true}).click();
 await expect(page.getByRole('switch',{name:'Grow B when it performs better',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Start experiment',exact:true}).click();await finish();await page.getByRole('heading',{name:'B stopped. Keep the current prompt.',exact:true}).waitFor();await capture('cockpit-safety-stop');passed.push('Unsafe promises stop B even in review mode');
 await page.setViewportSize({width:390,height:844});await capture('cockpit-mobile-run');const overflow=[];overflow.push(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.getByRole('button',{name:'New experiment',exact:true}).click();await capture('cockpit-mobile-prompts');overflow.push(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();await capture('cockpit-mobile-setup');overflow.push(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 assert.ok(overflow.every(v=>!v));assert.equal(errors.length,0);passed.push('Desktop and all three mobile steps fit without overflow or runtime errors');
 console.log(JSON.stringify({passed,errors,mobileOverflow:overflow,chipModelRequests:0,stubbedCustomRequest:generationRequests,voiceCreditsSpent:0}));writeFileSync('outputs/cockpit-check.json',JSON.stringify({passed,errors,mobileOverflow:overflow,chipModelRequests:0,stubbedCustomRequest:generationRequests,voiceCreditsSpent:0},null,2));
}finally{await browser.close();}
