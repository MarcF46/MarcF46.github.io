import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const base='http://127.0.0.1:8765/';
const widths=[320,360,390,430,768,1024,1366,1920];
const topPages=['index.html','projects.html','it-support-troubleshooting-50-tickets.html'];
const tickets=Array.from({length:20},(_,i)=>['index.html','runbook.html'].map(p=>'it-support/rb-'+String(i+1).padStart(3,'0')+'/'+p)).flat();
const paths=[...topPages,...tickets], folder='responsive-qa/screenshots';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
const issues=[],cases=[];
for(const path of paths){
 const sizes=(topPages.includes(path)||/rb-(001|006|019|020)\/(index|runbook)\.html/.test(path))?widths:[360,1366];
 for(const width of sizes){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const jsErrors=[],missing=[];
  page.on('pageerror',e=>jsErrors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))missing.push(r.status()+' '+r.url().slice(base.length));});
  try{
   const response=await page.goto(new URL(path,base).href,{waitUntil:'load',timeout:20000});
   await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.allSettled([...document.images].map(img=>{img.loading='eager';return img.decode();}));
   });
   const m=await page.evaluate(()=>{
    const w=innerWidth,h=document.querySelector('.site-header'),nav=document.querySelector('.nav-links'),menu=document.querySelector('.mobile-menu');
    const brokenImages=[...document.images].filter(x=>x.naturalWidth===0).map(x=>x.getAttribute('src'));
    const offenders=[...document.querySelectorAll('body *')].filter(el=>{
     const r=el.getBoundingClientRect(),s=getComputedStyle(el);
     if(r.height<1||r.width<1||s.visibility==='hidden'||s.display==='none')return false;
     if(r.left>=-2&&r.right<=w+2)return false;
     for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement)
      if(['auto','scroll','hidden','clip'].includes(getComputedStyle(p).overflowX))return false;
     return true;
    }).slice(0,6).map(el=>({tag:el.tagName,className:String(el.className||'').slice(0,80),left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)}));
    return {scrollWidth:document.documentElement.scrollWidth,navVisible:nav?getComputedStyle(nav).display!=='none':false,mobileVisible:menu?getComputedStyle(menu).display!=='none':false,banner:h?getComputedStyle(h).backgroundImage.includes('hannover-panorama-bild1-mitte.webp'):false,brokenImages,offenders};
   });
   if(response?.status()!==200)issues.push({path,width,type:'page-http',status:response?.status()});

   if(path==='projects.html'&&width===320&&m.scrollWidth>width+2){
    const details=await page.evaluate(()=>{
     const w=innerWidth,a=[],t=[],visibleText=[];
     const all=[...document.querySelectorAll('body *')];
     for(const el of all){
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
      if(el.clientWidth>0&&el.scrollWidth>el.clientWidth+3&&cs.overflowX==='visible'){
       a.push({tag:el.tagName,cls:String(el.className||'').slice(0,50),left:Math.round(r.left),right:Math.round(r.right),client:el.clientWidth,scroll:el.scrollWidth,text:(el.textContent||'').trim().slice(0,65)});
      }
     }
     const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
     let node;
     while((node=walk.nextNode())){
      if(!node.textContent.trim())continue;
      const range=document.createRange();range.selectNodeContents(node);
      const rects=[...range.getClientRects()];
      for(const r of rects){
       if(r.width<1||r.right<=w+2)continue;
       let scrollParent=false;
       for(let p=node.parentElement;p&&p!==document.body;p=p.parentElement){
        if(['auto','scroll','hidden','clip'].includes(getComputedStyle(p).overflowX)){scrollParent=true;break;}
       }
       if(!scrollParent)visibleText.push({text:node.textContent.trim().slice(0,90),right:Math.round(r.right),left:Math.round(r.left),parent:node.parentElement?.tagName,className:String(node.parentElement?.className||'').slice(0,50)});
      }
     }
     return {html:document.documentElement.scrollWidth,body:document.body.scrollWidth,visibleText:visibleText.slice(0,25),wideElements:a.slice(0,25)};
    });
    console.log('PROJECTS_320_DIAGNOSTIC '+JSON.stringify(details));
   }

   if(m.scrollWidth>width+2)issues.push({path,width,type:'horizontal-overflow',scrollWidth:m.scrollWidth,offenders:m.offenders});
   if(m.brokenImages.length)issues.push({path,width,type:'broken-images',images:m.brokenImages.slice(0,12)});
   if(jsErrors.length)issues.push({path,width,type:'javascript-errors',details:jsErrors.slice(0,5)});
   if(missing.length)issues.push({path,width,type:'missing-assets',details:[...new Set(missing)].slice(0,10)});
   if(!m.banner)issues.push({path,width,type:'missing-banner'});
   if(width<=760&&!m.mobileVisible)issues.push({path,width,type:'mobile-menu-not-visible'});
   if(width>760&&!m.navVisible)issues.push({path,width,type:'desktop-navigation-not-visible'});
   if(width<=760&&m.mobileVisible){
    await page.locator('.mobile-menu summary').click();
    const visible=await page.locator('.mobile-nav-links a:visible').count();
    if(visible!==5)issues.push({path,width,type:'mobile-menu-link-count',visible});
    const sw=await page.evaluate(()=>document.documentElement.scrollWidth);
    if(sw>width+2)issues.push({path,width,type:'opened-menu-overflow',scrollWidth:sw});
    await page.locator('.mobile-menu summary').click();
   }
   if(path==='index.html'&&width===1366){
    await page.evaluate(()=>scrollTo(0,700));await page.waitForTimeout(80);
    const y=await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().top);
    if(Math.abs(y)>2)issues.push({path,width,type:'sticky-header',y});
    await page.evaluate(()=>scrollTo(0,0));
   }
   if(['index.html','it-support-troubleshooting-50-tickets.html','it-support/rb-006/index.html'].includes(path)&&[390,768,1366].includes(width))
    await page.screenshot({path:join(folder,path.replace(/[/.]/g,'-')+'-'+width+'.png'),fullPage:false});
   cases.push({path,width,scrollWidth:m.scrollWidth,brokenImages:m.brokenImages.length});
  }catch(e){issues.push({path,width,type:'runner-exception',error:String(e).slice(0,350)});}
  finally{await page.close();}
 }
 console.log('AUDITED '+path+' '+sizes.length+' viewports');
}
await browser.close();
const report={pages:paths.length,viewports:widths,checks:cases.length,issues};
await writeFile('responsive-qa/report.json',JSON.stringify(report,null,2));
console.log('FINAL_RESPONSIVE_REPORT '+JSON.stringify(report));
if(issues.length)process.exit(1);
