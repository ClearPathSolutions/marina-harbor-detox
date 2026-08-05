import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const OUT = "/private/tmp/claude-501/-Users-benjamincastro-Marina-Harbor-Detox/9384d513-d329-4688-b36b-1982c42cc4a3/scratchpad/design";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3120";

const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--no-sandbox"],
});

const PAGES = [
  ["/", "home"],
  ["/what-we-offer/heroin-detox", "content"],
  ["/facility", "facility"],
  ["/about/team", "team"],
  ["/blog", "blog"],
  ["/admission", "admission"],
  ["/contact-location", "contact"],
];

async function shoot(path, name, w, h, tag) {
  const ctx = await b.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: w, height: h });
  // dismiss the consent banner so it doesn't cover the fold in every shot
  await p.evaluateOnNewDocument(() => localStorage.setItem("mhd-consent", "granted"));
  await p.goto(BASE + path, { waitUntil: "networkidle2", timeout: 90000 });
  await p.evaluate(async () => {
    document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
    // settle scroll-reveal animations
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 900));
    window.scrollTo(0, 0);
    await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await new Promise((r) => setTimeout(r, 2000));
  const metrics = await p.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }));
  const buf = await p.screenshot({ fullPage: true });
  // downscale tall full-page shots so they're readable
  const meta = await sharp(buf).metadata();
  const targetW = 620;
  await sharp(buf).resize({ width: targetW }).jpeg({ quality: 72 }).toFile(`${OUT}/${name}-${tag}.jpg`);
  console.log(`${(name + "-" + tag).padEnd(22)} ${metrics.height}px tall  overflow=${metrics.overflow}  (${meta.width}x${meta.height})`);
  await p.close(); await ctx.close();
}

for (const [path, name] of PAGES) await shoot(path, name, 1440, 900, "desktop");
for (const [path, name] of [["/", "home"], ["/what-we-offer/heroin-detox", "content"], ["/about/team", "team"]])
  await shoot(path, name, 390, 844, "mobile");

await b.close();
