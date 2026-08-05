import puppeteer from "puppeteer-core";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--no-sandbox"]});
const p=await b.newPage();
await p.setViewport({width:1440,height:1000});
await p.goto("http://localhost:3120/",{waitUntil:"domcontentloaded",timeout:90000});
const sample=async(t)=>{
  const m=await p.evaluate(()=>({h:document.documentElement.scrollHeight,w:document.documentElement.scrollWidth,imgs:document.images.length}));
  console.log(`  ${t.padEnd(22)} h=${m.h} w=${m.w} imgs=${m.imgs}`);
};
await sample("domcontentloaded");
await new Promise(r=>setTimeout(r,1500)); await sample("+1.5s");
await new Promise(r=>setTimeout(r,4000)); await sample("+5.5s");
console.log("\ntop 12 tallest elements:");
const tall=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll("body *").forEach(e=>{
    const r=e.getBoundingClientRect();
    if(r.height>2000) out.push({tag:e.tagName,cls:String(e.className).slice(0,64),h:Math.round(r.height),w:Math.round(r.width)});
  });
  return out.sort((a,b)=>b.h-a.h).slice(0,12);
});
tall.forEach(t=>console.log(`  ${String(t.h).padStart(6)}px  ${String(t.w).padStart(5)}w  ${t.tag}.${t.cls}`));
console.log("\nwidest elements (overflow source):");
const wide=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll("body *").forEach(e=>{
    const r=e.getBoundingClientRect();
    if(r.right>window.innerWidth+2) out.push({tag:e.tagName,cls:String(e.className).slice(0,56),right:Math.round(r.right),w:Math.round(r.width)});
  });
  return out.sort((a,b)=>b.right-a.right).slice(0,8);
});
wide.forEach(t=>console.log(`  right=${t.right} w=${t.w}  ${t.tag}.${t.cls}`));
await b.close();
