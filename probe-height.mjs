import puppeteer from "puppeteer-core";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--no-sandbox"]});
for (const consent of [null,"granted"]) {
  const ctx=await b.createBrowserContext(); const p=await ctx.newPage();
  await p.setViewport({width:1440,height:1000});
  if(consent) await p.evaluateOnNewDocument(c=>localStorage.setItem("mhd-consent",c),consent);
  await p.goto("http://localhost:3120/",{waitUntil:"networkidle2",timeout:90000});
  await new Promise(r=>setTimeout(r,6000));
  const m=await p.evaluate(()=>{
    const rev=[...document.querySelectorAll("h2")].find(h=>/hear from our patients/i.test(h.textContent));
    const sec=rev?.closest("section");
    return {
      docH:document.documentElement.scrollHeight,
      docW:document.documentElement.scrollWidth,
      overflow:document.documentElement.scrollWidth-window.innerWidth,
      reviewsSectionH: sec?Math.round(sec.getBoundingClientRect().height):null,
      tiNodes: document.querySelectorAll('[class*="ti-"],[id*="trustindex"]').length,
      tallest: (()=>{let best={t:"",h:0};document.querySelectorAll("body *").forEach(e=>{const h=e.getBoundingClientRect().height;if(h>best.h&&h<1e6)best={t:(e.tagName+"."+String(e.className).slice(0,40)),h:Math.round(h)};});return best;})(),
    };
  });
  console.log(`consent=${consent??"none"}  docH=${m.docH}  docW=${m.docW} overflow=${m.overflow}  reviewsSection=${m.reviewsSectionH}px  trustindexNodes=${m.tiNodes}`);
  console.log(`   tallest element: ${m.tallest.t} @ ${m.tallest.h}px`);
  await p.close(); await ctx.close();
}
await b.close();
