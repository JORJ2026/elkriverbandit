#!/usr/bin/env node
/* Tiny static server for local play: node scripts/serve.js [port] */
const http=require("http"),fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,".."),port=+process.argv[2]||8080;
const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".ico":"image/x-icon",".mp3":"audio/mpeg",".json":"application/json",".webmanifest":"application/manifest+json",".xml":"application/xml",".txt":"text/plain"};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split("?")[0]);if(p.endsWith("/"))p+="index.html";const f=path.join(root,p);
  if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end("Not found")}
  r.writeHead(200,{"Content-Type":T[path.extname(f)]||"application/octet-stream"});fs.createReadStream(f).pipe(r)}).listen(port,()=>console.log(`Elk River Bandit → http://localhost:${port}`));
