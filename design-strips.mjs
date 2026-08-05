import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { mkdirSync, rmSync, existsSync } from "node:fs";

const OUT = "/private/tmp/claude-501/-Users-benjamincastro-Marina-Harbor-Detox/9384d513-d329-4688-b36b-1982c42cc4a3/scratchpad/strips";
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });

const path = process.argv[2] || "/";
const name = process.argv[3] || "home";
const width = Number(process.argv[4] || 1440);
const STRIP = Number(process.argv[5] || 1500);

const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--no-sandbox"],
});
const ctx = await b.createBrowserContext();
const p = await ctx.newPage();
await p.setViewport({ width, height: 1000 });
await p.evaluateOnNewDocument(() => localStorage.setItem("mhd-consent", "granted"));
await p.goto("http://localhost:3120" + path, { waitUntil: "networkidle2", timeout: 90000 });
await p.evaluate(async () => {
  document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
  window.scrollTo(0, 0);
  await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
});
await new Promise((r) => setTimeout(r, 2000));

const buf = await p.screenshot({ fullPage: true });
const meta = await sharp(buf).metadata();
const n = Math.ceil(meta.height / STRIP);
for (let i = 0; i < n; i++) {
  const top = i * STRIP;
  const h = Math.min(STRIP, meta.height - top);
  await sharp(buf).extract({ left: 0, top, width: meta.width, height: h })
    .jpeg({ quality: 82 }).toFile(`${OUT}/${name}-${String(i + 1).padStart(2, "0")}.jpg`);
}
console.log(`${name}: ${meta.width}x${meta.height} -> ${n} strips of ${STRIP}px`);
await b.close();
