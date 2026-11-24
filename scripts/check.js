#!/usr/bin/env node
/* Sanity checks run in CI: JS syntax, JSON validity, local references exist, song list matches files. */
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,"..");let bad=0;
const fail=m=>{console.error("✗ "+m);bad++};const ok=m=>console.log("✓ "+m);
for(const f of["app.js","launch.js","sw.js","config.js","version.js","native/electron/main.js","native/electron/preload.js","scripts/build-web.js"]){
  try{new vm.Script(fs.readFileSync(path.join(root,f),"utf8"),{filename:f});ok("syntax "+f)}catch(e){fail(f+": "+e.message)}}
for(const f of["manifest.webmanifest","native/electron/package.json","native/capacitor/package.json","native/capacitor/capacitor.config.json"]){
  try{JSON.parse(fs.readFileSync(path.join(root,f),"utf8"));ok("json "+f)}catch(e){fail(f+": "+e.message)}}
const exists=(base,ref)=>{ref=ref.split("#")[0].split("?")[0];if(!ref||/^(https?:|mailto:|data:|#)/.test(ref))return true;return fs.existsSync(path.resolve(path.dirname(base),ref))};
const pages=["index.html","404.html",...fs.readdirSync(path.join(root,"info")).filter(f=>f.endsWith(".html")).map(f=>"info/"+f)];
for(const p of pages){const full=path.join(root,p),h=fs.readFileSync(full,"utf8");
  for(const m of h.matchAll(/(?:src|href)="([^"]+)"/g))if(!exists(full,m[1]))fail(`${p}: missing ${m[1]}`)}
ok("html references");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const list=/const songList=\[([^\]]*)\]/.exec(app);
if(!list)fail("songList not found");else{const ids=list[1].match(/'([^']+)'/g).map(s=>s.slice(1,-1));
  ids.forEach(id=>{if(!fs.existsSync(path.join(root,"audio",id+".mp3")))fail("missing song "+id)});ok(ids.length+" songs present");
  const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");ids.forEach(id=>{if(!sw.includes(`audio/${id}.mp3`))fail("sw.js does not cache "+id)});ok("sw.js caches all songs")}
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
for(const m of sw.matchAll(/"((?:\.\/|[\w\-]+\/)?[\w\-./]*\.[a-z0-9]+|\.\/)"/g)){const f=m[1];if(f==="./"||/^(erb-)/.test(f))continue;if(/\.(html|css|js|png|ico|mp3|webmanifest)$/.test(f)&&!fs.existsSync(path.join(root,f)))fail("sw.js lists missing file "+f)}
ok("sw.js file list");
const cfg=fs.readFileSync(path.join(root,"config.js"),"utf8");if(/OWNER|CHANGE_ME/.test(cfg))fail("config.js still has a placeholder");
if(bad){console.error(`\n${bad} problem(s)`);process.exit(1)}console.log("\nAll checks passed");
