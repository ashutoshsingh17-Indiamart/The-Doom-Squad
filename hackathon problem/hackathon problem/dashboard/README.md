# VoiceOps — Technical setup guide

A workspace for voice-agent prompt experiments, automatic call dispositions, controlled traffic allocation and complete decision reports.

The client walkthrough is [../README.md](../README.md). Product design decisions, the build journey and tools are in [../skills.md](../skills.md), and six PDF reports with matching audit data are in [../sample-outputs/README.md](../sample-outputs/README.md).

## Start

Use Node.js 22+. The backend reads credentials from the workspace-root `../.env`; secrets never enter the browser bundle.

```powershell
cd 'C:\hackathon problem\dashboard'
npm install
npm run dev
```

Open http://127.0.0.1:3000. React and the API share one origin. For Supabase, run `supabase/schema.sql` once in the SQL Editor. Both tables enable RLS and allow backend service-role access only. The existing schema also supports this expanded version; no new SQL is needed.

## Present the demo

1. **Prompt variants.** Choose an improvement chip to load its reviewed prompt immediately. All four suggestions are shipped with the app and use no model request. They preserve the current A prompt and append the selected instructions. Custom comments still use Generate variant B and a free OpenRouter model. Review the instruction diff, change summary or full prompt; either prompt can be edited.
2. **Experiment setup.** Select buyer goals: **Confirm requirement**, **Capture specifications**, and **Collect quantity**. A call succeeds only when every selected goal is met. Set starting B share, growth increment, maximum share, Automatic/Review first, growth/reduction switches, detail-quality protection and Standard/Stronger evidence. All controls affect decisions. The main interface contains no rehearsal or test-harness explanations.
3. **Results & rollout.** Start experiment or press Enter outside a control on setup. Prompt versions, goals and controls freeze at launch. Pause/resume the test. For presenting, **Alt+Enter** completes the current replay without an extra screen control. Calls include recordings, captured fields and transcript evidence.
4. The traffic graph and vertical stage report stay on the same screen. Each stage shows incoming traffic, **new A/B assignments and goal rates for that stage**, a separate cumulative table, then the checkpoint decision. Inspect stage/cumulative calls directly or open **Inspect checkpoint** for **Calls so far**, **This round**, and (when available) **Final comparison** scopes. Filter A/B and open any recording. Earlier checkpoints never include later calls.
5. **Show activity** opens the chronological round log: numbered buyers, assigned variant, outcome, each selected goal, duration, and the decision after that round. Final-comparison success stays distinct from cumulative results. **Export PDF** produces a searchable report containing stage-only and cumulative tables, numbered call audits, decisions, method and frozen prompts. Statistical method and sandbox data details also appear under View analysis details.

`node scripts/decision-audit-check.mjs` verifies all checkpoint scopes, goal columns, variant filters, transcript drill-down and focus return, all 50 numbered steps, report export, and mobile layout. Save endpoints are stubbed for this UI check; it does not add experiments to Supabase or call voice/model providers.

Replay consumes **no Sarvam or OpenRouter credits**. Editing a prompt does not change saved call outcomes. Use Try the agent to exercise a new prompt live.

New experiments automatically rotate through six conditions: B wins, grows then stops on safety, grows then retreats/holds, recovers after a slow start, stays steady, and loses to A. Fix a condition with `?pin=1&scenario=growth`, `late-safety`, `fade`, `recovery`, `hold` or `reverse`; these URLs use each path's declared seed. `?pin=1&seed=8` pins the original growth run (A 1/10, B 7/10; p ≈ 0.0198), and seed overrides remain available. Changing controls or goals can change the result. The scenarios select matching prepared recordings and cached verdicts; they are not production evidence.

Regular starts rotate even when an old `seed` or `scenario` remains in the URL; only explicit `pin=1` repeats a condition. Rotation persists across reloads in the same browser and falls back to memory if storage is blocked. Opening a saved report does not consume the next condition.

## Sample outputs and workspace guides

**Start new A/B** is the first navigation item; **Sample outputs** is second. The library reads complete outcomes from Supabase and presents each report's traffic path, success rates, call counts and final decision. Click anywhere on a card to open its full stage journey, evidence and recordings. The separate PDF action downloads the report directly. Completed report restores are read-only.

The other workspace destinations are **Buyer cohort**, **README**, **skills.md** and **Team details**. The workspace identifies **The Doom Squad**; Team details lists Prithvi Guha (93421), Ashutosh Singh (101592) and Soumyajeet Sen (93513). Prompt editing, call inspection and recommendations remain within the experiment journey. **View all calls** expands a searchable call table inside the report with product/variant filters and every selected goal.

The guides render the actual root Markdown files with responsive tables, linked SVG graphics, section navigation and Markdown downloads. `#/readme` and `#/skills` open directly and survive refresh. The Markdown reader loads only when a guide is opened; it does not increase the initial experiment JavaScript bundle. Document links open the other guides or download the bundled PDF/JSON artifacts and configuration templates.

Six distinct outcomes replace the original demo history. New experiments continue saving normally. The backend validates scenario names against the shared six-condition catalogue, with the older safety-regression fixture retained for diagnostics.

`npm run outcomes:replace` is an explicit maintenance command that replaces experiment history in the configured demo Supabase project. It backs up all existing experiment rows to ignored `work/`, writes and verifies the six prepared outcomes, then deletes only the backed-up old IDs. It does not delete prompt versions, reset on app startup, or call providers. `node scripts/saved-outcomes-check.mjs` verifies the six reports, read-only restores, rotation under legacy URL parameters, reload persistence, PDFs and responsive layouts without writing verification runs to Supabase.

## Cohort and recordings

50 distinct synthetic buyers span T-shirts, office chairs, LED bulbs, packaging boxes, water pumps, and safety shoes. Conversations include no answers, wrong numbers, complaints, completed purchases, busy buyers requesting callbacks, partial requirements, custom preferences, and successful collection.

The 135 distinct WAVs cover both A/B and safety examples; 150 persona/scenario references reuse identical recordings where appropriate. Connected calls use Sarvam Bulbul v3, Indian English, six buyer voices (three male and three female) and two caller voices. Buyer gender matches the assigned voice, and caller/buyer use different voices. Unanswered calls contain ringback, not invented conversation. WAV durations are measured from actual audio.

`shared/evaluations.mjs` contains **actual OpenRouter LLM verdicts** generated during preparation. The evaluator reads transcripts, tags a disposition, and extracts buyer-supported evidence. Backend validation rejects unsupported field quotes and ensures incomplete fields cannot count as Buyer enriched. Known context fields are excluded from capture. Identical transcripts reuse an evaluated verdict. Ground-truth scenario expectations are not supplied to the evaluator.

## Metrics and experiment policy

- **Goal success rate:** calls meeting every selected buyer goal / all assigned calls. Goals use evaluated dispositions and buyer-supported extracted fields. Unanswered calls, refusals and unsafe calls cannot succeed. Outcomes remain separate: a partial call may supply some selected fields without satisfying all three goals.
- **Requirement capture:** recorded quantity and two specification fields / three, averaged over all attempted calls. A partial call can score 0%, 33%, 67%, or 100%. Known name/city do not count.
- **Contact rate:** answered / attempted. Outcome counts remain visible separately.
- **Duration:** measured recording length; available per call.

The first 30 buyers are an adaptive pilot, reviewed after 15 and 30 calls. Shares round to whole calls. A promising, safe pilot may expand by the chosen 10/20/25-point increment, up to 60% during the pilot; poorer performance halves exposure when automatic reduction is enabled. The growth switch controls increases and the final winner rollout. Detail protection blocks expansion when B collects fewer fields and can reduce exposure on a large capture drop. An unsupported price or availability promise stops B even in Review first mode.

At launch, 20 buyers are reserved and assigned **10 A / 10 B**, independently of pilot outcomes. This balanced confirmation is predeclared and stays fixed regardless of the adaptive growth/reduction switches. Checkpoints occur after 15, 30, 40, and 50 calls. The internal fixed four-hour simulated window is retained in stored/exported metadata; it is not a product setup control. Alt+Enter advances to completion.

The final winner uses **only reserved confirmation outcomes**, a two-sided Fisher exact test with p < 0.05 for Standard or p < 0.01 for Stronger evidence, at least eight assignments per variant and no safety violations. Detail protection also checks final comparison capture. Pilot data is excluded. A supported B winner promotes to the selected 50/75/100% limit when automatic growth is enabled. Other cases give a recommendation. Synthetic significance demonstrates the policy; it does not prove a production improvement or evaluate an arbitrary edited prompt.

The decline/recovery/steady/control paths review adaptive evidence at the second pilot checkpoint and can retain a limited experimental share on an inconclusive result. The fixed final comparison remains independent of that traffic target. The sustained-growth path explicitly switches to a balanced comparison at checkpoint 2. The stage view labels the comparison group so its assignments are not mistaken for adaptive traffic.

## Live agent

Try the agent supports six products, A/B, English or Hindi/Hinglish, and selectable male/female Sarvam voices. The opening identifies IndiaMART naturally. Known buyer name/city are editable; clear them to test missing identity collection. The agent confirms intent, collects buyer-supported fields, handles corrections and refusals, and limits retries. It must not claim to be human or promise prices/availability.

Text uses OpenRouter. Voice replies use Sarvam TTS; microphone input uses Sarvam STT. Recording stops after 25 seconds and transcription can be reviewed before sending. No phone call, real requirement posting, or seller contact occurs.

## Preparation and verification

The prepared audio and evaluator verdicts are shipped with the app. Regeneration uses credits and is resumable; do not run it before every presentation.

```powershell
npm run record:demo
npm run evaluate:demo
npm test
npm run build
npm run samples
node scripts/browser-check.mjs
node scripts/decision-audit-check.mjs
node scripts/scenario-journey-check.mjs
node scripts/client-guide-check.mjs
node scripts/check-client-secrets.mjs
```

Recording preparation caches each speaker/text clip and respects rate limits. Evaluator preparation caches transcript verdicts and retries alternate free providers. Atomic manifest updates avoid partially written browser assets. Provider failures are reported; pending calls are never silently presented as LLM-evaluated.

The browser check verifies all four instant chips without model requests, goal selectors, rollout controls, winner/rollback/inconclusive paths and desktop/mobile layouts. Screenshots are saved under `outputs/`. It consumes no Sarvam or OpenRouter credits. The custom prompt writer still depends on free-provider availability.

`client-guide-check.mjs` verifies the workspace navigation, source Markdown rendering/downloads, graphics, section links, technical/artifact links, whole-card and keyboard opening, independent PDF actions, in-report call filters, direct guide URLs and desktop/mobile layout. It uses local fixture responses and makes no persistence or provider requests.

`npm run samples` creates the six reports and complete audit JSON under `../sample-outputs/`, using the same replay transitions and PDF exporter as the UI. It consumes no credits and performs no database writes. `scenario-journey-check.mjs` verifies automatic rotation, six traffic paths, a pinned path and five viewport widths; screenshots for judging go into `../sample-outputs/screenshots/`. `python scripts/verify-report-pdfs.py` is an optional PyMuPDF QA check for extracted call names, evidence scopes, clipping and footer collisions. PyMuPDF is a local verification tool, not an app dependency.

The local server binds to loopback. Shared deployment still needs authenticated workspace access. Build output includes the React frontend and a portable Fetch API worker; publishing is separate.
