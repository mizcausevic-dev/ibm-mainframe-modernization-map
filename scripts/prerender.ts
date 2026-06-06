import { mkdir, writeFile } from "node:fs/promises";
import { buildMap } from "../src/index.js";
import sample from "../fixtures/mainframe-modernization-sample.json" with { type: "json" };

const map = buildMap(sample);
const cards = map.workloads
  .map(
    (workload) => `
      <article class="card">
        <div class="top"><span>${workload.tier}</span><strong>${workload.modernizationScore}</strong></div>
        <h3>${workload.name}</h3>
        <p>${workload.narrative}</p>
        <div class="chips">${workload.languageMix.map((language) => `<span>${language}</span>`).join("")}</div>
        <dl>
          <div><dt>Batch window</dt><dd>${workload.batchWindowHours}h</dd></div>
          <div><dt>Dependencies</dt><dd>${workload.dependencyCount}</dd></div>
          <div><dt>API coverage</dt><dd>${workload.apiCoverage}%</dd></div>
          <div><dt>Run cost</dt><dd>$${workload.annualRunCostMillions}M</dd></div>
        </dl>
        <p class="action">${workload.nextAction}</p>
      </article>`
  )
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>IBM Mainframe Modernization Map</title>
  <meta name="description" content="Board-readable IBM mainframe modernization map for COBOL, JCL, DB2, API coverage, batch risk, and migration sequencing." />
  <style>
    :root {
      color-scheme: dark;
      --bg:#050812; --panel:#0c1625; --panel2:#111c2f; --text:#f4f1e8; --muted:#a8b5c7;
      --cyan:#27d8f4; --mint:#55f2bc; --amber:#ffd166; --line:rgba(85,242,188,.24);
    }
    *{box-sizing:border-box}
    body{margin:0;background:radial-gradient(circle at 20% 0%,rgba(39,216,244,.14),transparent 34rem),radial-gradient(circle at 90% 20%,rgba(255,209,102,.13),transparent 30rem),var(--bg);color:var(--text);font-family:"Segoe UI",system-ui,sans-serif}
    main{width:min(1180px,calc(100vw - 32px));margin:auto;padding:64px 0}
    .hero{border:1px solid var(--line);border-radius:30px;background:linear-gradient(135deg,rgba(17,28,47,.96),rgba(7,10,21,.95));padding:clamp(28px,5vw,58px);box-shadow:0 30px 90px rgba(0,0,0,.35)}
    .eyebrow{color:var(--amber);letter-spacing:.18em;text-transform:uppercase;font:800 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}
    h1{max-width:980px;margin:18px 0;font-size:clamp(44px,8vw,104px);line-height:.91;letter-spacing:-.06em}
    .lede{max-width:780px;color:var(--muted);font-size:clamp(18px,2.2vw,24px);line-height:1.55}
    .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:34px}
    .metric{border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.04);padding:20px}
    .metric strong{display:block;font-size:34px}.metric span{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.12em}
    .section{margin-top:28px;border:1px solid var(--line);border-radius:28px;background:rgba(12,22,37,.78);padding:clamp(22px,3vw,34px)}
    h2{margin:0 0 18px;font-size:clamp(30px,4vw,54px);line-height:1;letter-spacing:-.04em}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
    .card{border:1px solid rgba(255,255,255,.1);border-radius:22px;background:var(--panel2);padding:22px}
    .top{display:flex;justify-content:space-between;color:var(--cyan);font:800 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.14em}.top strong{color:var(--mint);font-size:30px;letter-spacing:0}
    h3{margin:16px 0 10px;font-size:25px;line-height:1.08}p{color:var(--muted);line-height:1.55}.chips{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.chips span{border:1px solid rgba(39,216,244,.25);border-radius:999px;padding:8px 10px;color:var(--cyan);font:700 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}
    dl{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}dt{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.1em}dd{margin:4px 0 0;font-weight:800}.action{color:var(--text);border-top:1px solid rgba(255,255,255,.08);padding-top:14px}
    footer{color:var(--muted);padding-top:24px;font-size:14px}
    @media(max-width:760px){main{padding:28px 0}.metrics,.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="eyebrow">IBM modernization signal</div>
      <h1>Mainframe risk becomes an investment sequence, not a rewrite slogan.</h1>
      <p class="lede">IBM Mainframe Modernization Map turns COBOL, JCL, DB2, batch windows, API gaps, test coverage, and run-cost pressure into board-readable migration posture.</p>
      <div class="metrics">
        <div class="metric"><strong>${map.summary.workloadCount}</strong><span>Workloads</span></div>
        <div class="metric"><strong>${map.summary.meanModernizationScore}</strong><span>Mean modernization score</span></div>
        <div class="metric"><strong>$${map.summary.totalRunCostMillions}M</strong><span>Annual run cost</span></div>
        <div class="metric"><strong>${map.summary.rebuildCandidates}</strong><span>Rebuild candidates</span></div>
      </div>
    </section>
    <section class="section">
      <h2>Modernization register</h2>
      <p><strong>Primary recommendation:</strong> ${map.summary.primaryRecommendation}</p>
      <div class="grid">${cards}</div>
    </section>
    <footer>IBM Mainframe Modernization Map · synthetic proof surface · no production workload data</footer>
  </main>
</body>
</html>`;

await mkdir("site", { recursive: true });
await writeFile("site/index.html", html);
