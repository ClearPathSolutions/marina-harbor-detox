import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const OUT = "/private/tmp/claude-501/-Users-benjamincastro-Marina-Harbor-Detox/9384d513-d329-4688-b36b-1982c42cc4a3/scratchpad/design";
mkdirSync(OUT, { recursive: true });

const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--no-sandbox"],
});
const ctx = await b.createBrowserContext();
const p = await ctx.newPage();
await p.setViewport({ width: 1440, height: 1000 });
await p.evaluateOnNewDocument(() => localStorage.setItem("mhd-consent", "granted"));
await p.goto("http://localhost:3120" + (process.argv[2] || "/"), { waitUntil: "networkidle2", timeout: 90000 });
await p.evaluate(async () => {
  document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise((r) => setTimeout(r, 1200));
  window.scrollTo(0, 0);
  await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
});
await new Promise((r) => setTimeout(r, 1500));

// measure every top-level section: height, background, and the gap to the next
const report = await p.evaluate(() => {
  const secs = [...document.querySelectorAll("main section")].filter(s => s.getBoundingClientRect().height > 80 && !s.parentElement.closest("section"));
  return secs.map((s, i) => {
    const r = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const h2 = s.querySelector("h2, h1");
    return {
      i,
      label: (h2?.textContent || "(no heading)").trim().slice(0, 46),
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
      padTop: cs.paddingTop,
      padBottom: cs.paddingBottom,
      bg: cs.backgroundColor,
      cls: s.className.slice(0, 70),
    };
  });
});
console.log("SECTION RHYTHM");
console.log("idx  top     height  padT/padB      background                 heading");
let prevBottom = null;
for (const s of report) {
  const gap = prevBottom === null ? "" : `gap:${s.top - prevBottom}`;
  console.log(`${String(s.i).padStart(2)}  ${String(s.top).padStart(6)}  ${String(s.height).padStart(6)}  ${(s.padTop + "/" + s.padBottom).padEnd(14)} ${s.bg.padEnd(26)} ${s.label}  ${gap}`);
  prevBottom = s.top + s.height;
}

const sections = await p.$$("main section");
for (let i = 0; i < sections.length; i++) {
  try {
    await sections[i].screenshot({ path: `${OUT}/sec-${String(i).padStart(2, "0")}.png` });
  } catch { /* zero-height */ }
}
console.log(`\nwrote ${sections.length} section screenshots`);
await b.close();
