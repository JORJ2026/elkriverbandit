#!/usr/bin/env node
/* Copies the web game into <outDir> (used by Pages, Electron and Capacitor builds).
   Usage: node scripts/build-web.js <outDir> [version]   — version stamps version.js and sw.js */
const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const out=path.resolve(process.argv[2]||"dist/www"),ver=(process.argv[3]||"").replace(/^v/,"");
const FILES=["index.html","style.css","launch.css","app.js","launch.js","config.js","version.js","sw.js","manifest.webmanifest","favicon.ico","404.html","robots.txt",".nojekyll"];
const DIRS=["icons","img","audio","info"];
function cp(src,dst){fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst)}
function walk(d,fn){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p,fn):fn(p)}}
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const f of FILES){const s=path.join(root,f);if(fs.existsSync(s))cp(s,path.join(out,f))}
for(const d of DIRS)walk(path.join(root,d),p=>cp(p,path.join(out,path.relative(root,p))));
cp(path.join(root,"store/screenshots/01-title.png"),path.join(out,"store/screenshots/01-title.png"));
if(ver){
  const date=new Date().toISOString().slice(0,10);
  fs.writeFileSync(path.join(out,"version.js"),`window.ERB_VERSION="${ver}";window.ERB_BUILD="${date}";\n`);
  const sw=path.join(out,"sw.js");fs.writeFileSync(sw,fs.readFileSync(sw,"utf8").replace(/const VERSION="[^"]*"/,`const VERSION="${ver}"`));
}
// sitemap for the web build
const cfg=fs.readFileSync(path.join(root,"config.js"),"utf8"),m=/siteUrl:\s*"([^"]+)"/.exec(cfg);
if(m){const base=m[1].replace(/\/?$/,"/"),pages=["","info/how-to-play.html","info/support.html","info/privacy.html","info/terms.html","info/credits.html","info/changelog.html"];
  fs.writeFileSync(path.join(out,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`  <url><loc>${base}${p}</loc></url>`).join("\n")}\n</urlset>\n`);
  fs.writeFileSync(path.join(out,"robots.txt"),`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`)}
let n=0,b=0;walk(out,p=>{n++;b+=fs.statSync(p).size});
console.log(`web build → ${path.relative(process.cwd(),out)} (${n} files, ${(b/1048576).toFixed(1)} MB${ver?`, v${ver}`:""})`);
