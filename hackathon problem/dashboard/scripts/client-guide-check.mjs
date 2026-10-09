import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {demoScenarios} from '../shared/demo-scenarios.mjs';
import {completeExperiment,preparedExperiment} from '../shared/experiment-run.mjs';

mkdirSync('outputs',{recursive:true});mkdirSync('../sample-outputs/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],passed=[];
let saves=0,providerCalls=0;
page.on('pageerror',e=>errors.push(e.message));
const history=demoScenarios.map((profile,index)=>{const payload=completeExperiment(preparedExperiment(profile.id));return {id:payload.id,name:profile.name,scenario:profile.id,status:payload.status,created_at:`2026-10-09T09:0${index}:00.000Z`,payload};});
await page.route('**/api/experiments',route=>route.fulfill({json:history}));
await page.route('**/api/status',route=>route.fulfill({json:{database:'ready',detail:'Verification'}}));
await page.route('**/api/models',route=>route.fulfill({json:[]}));
await page.route('**/api/experiments/save',route=>{saves++;return route.fulfill({json:{id:route.request().postDataJSON().id}});});
await page.route('**/api/prompts/save',route=>route.fulfill({json:{id:'verification'}}));
for(const path of ['prompts/generate','live/**','speech','transcribe'])await page.route(`**/api/${path}`,route=>{providerCalls++;return route.fulfill({status:500,json:{error:'Unexpected provider request'}});});
const nav=label=>page.locator('.sidebar').getByRole('button',{name:label,exact:true});
async function capture(name){await page.screenshot({path:`../sample-outputs/screenshots/${name}.png`});}
async function overflow(){return page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);}
try{
 await page.goto('http://127.0.0.1:3000/#/readme');
 await expect(page.locator('h1')).toHaveText('README');
 await expect(page.locator('.sidebar .nav-item')).toHaveText(['Start new A/B','Sample outputs','Buyer cohort','README','skills.md','Team details']);
 await expect(page.locator('.guide-document-title')).toContainText('Better buyer conversations');
 await expect(page.locator('.guide-article img')).toHaveCount(2);
 await page.locator('.guide-article img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode();})));
 assert.equal(await overflow(),false);await capture('client-readme-desktop');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download Markdown',exact:true}).click();const file=await download;assert.equal(file.suggestedFilename(),'README.md');await file.saveAs('outputs/client-readme.md');assert.equal(readFileSync('outputs/client-readme.md','utf8'),readFileSync('../README.md','utf8'));
 await page.getByRole('button',{name:'Inspect the evidence behind any result',exact:true}).click();
 await expect(page.locator('#guide-inspect-the-evidence-behind-any-result')).toBeInViewport();
 passed.push('README renders the source file with graphics, working contents and exact Markdown download');
 await page.locator('.guide-article').getByRole('link',{name:'skills.md',exact:true}).click();
 await expect(page.locator('h1')).toHaveText('skills.md');await expect(page.locator('.guide-document-title')).toContainText('Product design & engineering');
 await page.locator('.guide-article img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode();})));
 await capture('client-skills-desktop');assert.equal(await overflow(),false);
 for(const width of [1280,1024,768,390]){await page.setViewportSize({width,height:844});assert.equal(await overflow(),false);}
 assert.ok(await page.locator('.guide-intro>div').evaluate(el=>el.getBoundingClientRect().width)>=150,'Mobile introduction must keep readable text width');
 assert.ok(await page.locator('.guide-intro').evaluate(el=>el.getBoundingClientRect().height)<=240,'Mobile introduction must not collapse into vertical text');
 await capture('client-skills-mobile');await nav('README').click();await expect(page.locator('.guide-document-title')).toContainText('Better buyer conversations');
 assert.equal(await overflow(),false);await capture('client-readme-mobile');
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('.guide-article').getByRole('link',{name:'technical setup guide',exact:true}).click();await expect(page.locator('.guide-intro h2')).toHaveText('Technical setup guide');
 await page.getByRole('button',{name:'Back to README',exact:true}).click();
 await page.locator('.guide-article').getByRole('link',{name:'sample artifact index',exact:true}).click();await expect(page.locator('.guide-intro h2')).toHaveText('Report artifacts');
 const pdf=page.waitForEvent('download');await page.locator('.guide-article').getByRole('link',{name:'PDF',exact:true}).first().click();const pdfFile=await pdf;assert.equal(pdfFile.suggestedFilename(),'growth.pdf');await pdfFile.saveAs('outputs/guide-linked-report.pdf');assert.ok(readFileSync('outputs/guide-linked-report.pdf','ascii').startsWith('%PDF'));
 passed.push('skills.md, technical guide and PDF artifact links work; both guides fit desktop and mobile');
 await nav('Sample outputs').click();await expect(page.locator('h1')).toHaveText('Sample outputs');await expect(page.locator('.saved-outcome-card')).toHaveCount(6);await capture('saved-outcomes-desktop');
 const card=page.getByRole('article',{name:history[0].name,exact:true});
 await card.click({position:{x:40,y:40}});await expect(page.locator('h1')).toHaveText('Experiment report');await expect(page.locator('.page-heading')).toContainText(history[0].name);
 await page.getByRole('button',{name:'View all calls',exact:true}).click();const all=page.getByRole('region',{name:'All experiment calls',exact:true});
 await expect(all.locator('tbody tr')).toHaveCount(50);for(const goal of ['Confirm requirement','Capture specifications','Collect quantity'])await expect(all.getByRole('columnheader',{name:goal,exact:true})).toBeVisible();
 await page.getByLabel('Filter calls by variant',{exact:true}).selectOption('B');await expect(all.locator('tbody tr')).toHaveCount(19);
 await page.getByLabel('Search calls',{exact:true}).fill(history[0].payload.calls.find(c=>c.variant==='B').persona.name);await expect(all.locator('tbody tr')).toHaveCount(1);await all.getByRole('button',{name:/^View .* call$/}).click();await expect(page.getByRole('dialog',{name:'Call details'})).toBeVisible();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Close call list',exact:true}).click();
 await nav('Sample outputs').click();
 const event=page.waitForEvent('download');await page.getByRole('button',{name:`Download PDF: ${history[0].name}`,exact:true}).click();await event;await expect(page.locator('h1')).toHaveText('Sample outputs');
 const second=page.getByRole('article',{name:history[1].name,exact:true});await second.getByRole('button',{name:'Open outcome',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.page-heading')).toContainText(history[1].name);
 assert.equal(saves,0);passed.push('Whole cards and keyboard open reports read-only; PDF actions stay independent; all-call filters and drill-down remain in the report');
 await nav('Sample outputs').click();await page.setViewportSize({width:390,height:844});assert.equal(await overflow(),false);await capture('saved-outcomes-mobile');await page.setViewportSize({width:1440,height:1000});
 await nav('README').click();await page.locator('.guide-end').getByRole('button',{name:'Start new A/B',exact:true}).click();await expect(page.getByRole('heading',{name:'Create your challenger prompt.',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Explain unfamiliar specs',exact:false}).click();await page.getByRole('button',{name:'Next: set up experiment',exact:true}).click();await expect(page.getByRole('heading',{name:'Experiment setup',exact:true})).toBeVisible();
 await nav('README').click();await page.reload();await expect(page.locator('h1')).toHaveText('README');await expect(page.locator('.guide-document-title')).toBeVisible();
 passed.push('Guide actions lead into the prompt/setup journey and direct guide URLs survive refresh');
 assert.equal(providerCalls,0);assert.deepEqual(errors,[]);const result={passed,providerCalls,readOnlyReportSaves:saves,mobileOverflow:false,errors};writeFileSync('outputs/client-guide-check.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}
