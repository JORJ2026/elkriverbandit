
const c=document.getElementById('c'),W=960,H=540,G=420;let x=c.getContext('2d');
let diff=1,_p=0,S='intro',dist=0,v=0,loot=0,best=0,t=0,introT=0,shake=0,objs=[],parts=[],nextX=0,P,hi=0,lvl=0,cp=0,banner=0,flash=0,M,pops=[],rings=[],trail=[],sq=0,shoot=null,dflash=0,hl=0,bump=0,who=0,base=0,gSel=0,gPrev='title',conf=[],fw=[],spk=[],celeb=0,celN=0;
const DF=[{n:'EASY',spd:.88,haz:.6,sp:1.2,col:'#7be07b',d:'Relaxed pace, fewer hazards'},{n:'NORMAL',spd:1,haz:1,sp:1,col:'#ffd23f',d:'The intended heist'},{n:'HARD',spd:1.12,haz:1.25,sp:.92,col:'#ff6b6b',d:'Faster and packed with hazards'}],LEN=7000,NM=60,SPD=l=>(340+Math.min(l,29)*11+Math.max(0,l-29)*2.5)*DF[diff].spd,hs=(h,s,l)=>`hsl(${h%360},${s}%,${l}%)`;
// [name, sky hue, horizon hue, weather(0 none,1 rain,2 snow,3 fog,4 embers,5 fireflies,6 storm), daylight 0-1]
const LV=[['Sunset Pier',260,18,0,0],['Fisherman’s Wharf',215,35,0,.15],['Neon Marina',290,320,0,0],['Cannery Row',30,10,3,.1],['Lighthouse Point',225,200,0,0],['Rainy Docks',210,200,1,0],['Shipyard Rust',15,25,0,.1],['Coral Cove',175,15,0,.4],['Moonlit Lagoon',225,195,5,0],['Carnival Boardwalk',320,45,0,0],['Midday Harbor',205,190,0,1],['Seagull Cliffs',200,30,0,.9],['Foggy Bay',200,210,3,.2],['Smuggler’s Cove',140,50,3,0],['Thunder Bay',250,260,6,0],['Golden Hour',35,20,0,.6],['Winter Wharf',210,200,2,.3],['Frozen Harbor',190,185,2,.5],['Aurora Bay',150,280,2,0],['Crimson Tide',350,10,4,0],['Volcano Dock',10,30,4,.1],['Jade Canal',150,120,5,.1],['Sakura Port',330,350,0,.5],['Desert Pier',35,45,0,.8],['Twilight Bridge',270,320,0,.2],['Ghost Ship Graveyard',170,160,3,0],['Storm Surge',220,230,6,0],['Emerald Docks',135,110,5,.2],['Midnight Heist',265,280,0,0],['Bandit’s Dawn',330,35,0,.7]];
LV.push(['Maple Landing',25,15,7,.6,2],['Pine Ridge Dock',150,140,0,.5,2],['Elk River Falls',195,170,3,.6,1],['Granite Gorge',20,30,0,.5,1],['Copper Canyon',20,12,9,.7,1],['Sandstone Quay',40,35,9,.85,4],['Pyramid Piers',45,25,0,.8,4],['Oasis Night',230,160,5,0,4],['Pagoda Pier',330,20,7,.4,3],['Lantern Festival',350,30,5,0,3],['Koi Canal',190,340,0,.5,3],['Bamboo Wharf',125,100,1,.3,2],['Castle Quay',250,280,0,.25,6],['Dragon’s Keep',0,20,4,0,6],['Knight’s Harbor',215,220,0,.7,6],['Foundry Row',15,20,4,.1,5],['Smokestack Bay',210,30,3,.2,5],['Gearworks Dock',30,45,0,.3,5],['Reactor Pier',110,130,5,0,5],['Kelp Forest',185,160,8,.3,2],['Sunken Galleon',200,215,8,.15,0],['Abyss Terrace',230,245,8,0,0],['Pearl Lagoon',170,320,8,.5,1],['Iceberg Alley',200,195,2,.5,1],['Polar Night',235,260,2,0,1],['Borealis Bay',160,290,2,0,1],['Storm Front',255,240,6,0,0],['Typhoon Tide',200,210,6,.1,0],['Meteor Marina',270,300,10,0,0],['Elk River Sunrise',340,40,7,.7,0]);
const wx=Array.from({length:90},()=>({x:Math.random()*W,y:Math.random()*H,s:Math.random()}));
// hazards per map: c=patrolling cop (jump), b=rolling barrel (jump), h=hanging hazard (slide), s=jet that pulses on/off (time it or jump)
const HZ=['b','bc','ch','sb','ch','bh','hb','sc','hs','hc','cb','bh','cs','cbh','sc','bhc','hb','hc','hs','sc','sb','hc','bc','sb','chs','chs','sbc','hsb','cbhs','cbhs'];
HZ.push('bch','chs','sbh','bcs','chs','sbc','hbc','chs','cbh','hsb','cbs','bhs','cbh','chs','cbhs','sbh','chs','cbhs','shc','bhs','cbhs','hsb','cbs','chs','cbhs','shb','cbhs','cbhs','cbhs','cbhs');
for(let i=0;i<NM;i++)HZ[i]+='e'.repeat(i<10?1:i<30?2:i<45?2:3);
function hazard(o){const m=LV[Math.min(lvl,NM-1)],hz=HZ[Math.min(lvl,NM-1)],k=hz[(Math.random()*hz.length)|0],w=m[3];
 if(k=='c')objs.push({t:'cop',x:o+200,ph:0});
 else if(k=='b')objs.push({t:'barrel',x:o+200,ph:0});
 else if(k=='h')objs.push({t:'hang',x:o,st:w==2?'ice':(lvl==9||lvl==38||lvl==39)?'lantern':'hook'});
 else if(k=='e')objs.push(mkEn(ENP[Math.min(lvl,NM-1)],o+200));
 else objs.push({t:'spout',x:o,st:w==4?'fire':(w==3||w==1)?'steam':'geyser',off:rnd(0,3)});
 nextX+=(k=='c'||k=='b'||k=='e')?rnd(520,700):rnd(420,560)}
try{hi=+localStorage.getItem('bb2')||0}catch(e){}
try{who=+localStorage.getItem('erb_ch')||0}catch(e){}
let trashCount=0,trashCleared=[],trashToast=0;try{trashCount=+localStorage.getItem('erb_trash_count')||0;trashCleared=JSON.parse(localStorage.getItem('erb_trash_cleared')||'[]')}catch(e){}
function awardTrash(i){if(trashCleared.includes(i))return;trashCleared.push(i);trashCount++;trashToast=2.6;try{localStorage.setItem('erb_trash_count',trashCount);localStorage.setItem('erb_trash_cleared',JSON.stringify(trashCleared))}catch(e){}}
function setCh(n){who=(n+CH.length)%CH.length;try{localStorage.setItem('erb_ch',who)}catch(e){}}
const rnd=(a,b)=>a+Math.random()*(b-a);
const stars=Array.from({length:90},()=>({x:rnd(0,W),y:rnd(0,250),r:rnd(.4,1.4),p:rnd(0,6)}));
const clouds=Array.from({length:8},()=>({x:rnd(0,W*1.5),y:rnd(30,200),s:rnd(.6,1.5),sp:rnd(.2,.5)}));
const CH=[{n:'Raccoon',d:'the original',kind:'raccoon'},{n:'Possum',d:'Pogo the possum',kind:'possum'},{n:'Cat',d:'quick paws',kind:'cat'},{n:'Dog',d:'loyal bandit',kind:'dog'},{n:'Crow',d:'sharp-eyed',kind:'crow'},{n:'Armadillo',d:'tough shell',kind:'armadillo'},{n:'Mouse',d:'tiny trouble',kind:'mouse'},{n:'Bear',d:'big-hearted',kind:'bear'},{n:'Coyote',d:'river runner',kind:'coyote'}];
const E_=(a,b,rx,ry,c)=>{x.fillStyle=c;x.beginPath();x.ellipse(a,b,rx,ry,0,0,7);x.fill()},R_=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(a,b,w,h)},EY=(a,b,r)=>{E_(a,b,r,r,'#fff');E_(a+r*.2,b,r*.5,r*.5,'#111')};
// 20 extra enemies. s=speed toward player, y0=fixed top (air), st=per-frame behaviour, dr=draw (sx,y,o)
const EN={
 crab:{n:'Crab',w:34,h:22,s:90,dr:(sx,y,o)=>{const a=Math.sin(o.ph*14)*2;x.strokeStyle='#b8402b';x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();x.moveTo(sx+6+i*3,y+17);x.lineTo(sx+1+i*2,y+23+(i%2?a:-a));x.moveTo(sx+28-i*3,y+17);x.lineTo(sx+33-i*2,y+23+(i%2?-a:a));x.stroke()}E_(sx+17,y+13,15,9,'#e0553a');E_(sx+3,y+8+a,6,5,'#f26a4b');E_(sx+31,y+8-a,6,5,'#f26a4b');R_(sx+11,y+2,2,5,'#b8402b');R_(sx+21,y+2,2,5,'#b8402b');EY(sx+12,y+3,3);EY(sx+22,y+3,3)}},
 rat:{n:'Rat',w:28,h:16,s:250,dr:(sx,y,o)=>{const a=Math.sin(o.ph*30)*2;x.strokeStyle='#d99';x.lineWidth=2;x.beginPath();x.moveTo(sx+24,y+10);x.quadraticCurveTo(sx+32,y+4+a,sx+36,y+12);x.stroke();E_(sx+15,y+10,11,6,'#7a6f6a');E_(sx+5,y+9,6,5,'#8a7f7a');E_(sx+7,y+4,3,3,'#e9a');E_(sx+1,y+10,2,2,'#f48');R_(sx+12+a,y+14,3,3,'#544');R_(sx+19-a,y+14,3,3,'#544');EY(sx+5,y+8,1.8)}},
 docker:{n:'Dock Worker',w:28,h:52,s:110,dr:(sx,y,o)=>{const a=Math.sin(o.ph*8)*5;R_(sx+7+a,y+38,6,14,'#2a3a5a');R_(sx+15-a,y+38,6,14,'#2a3a5a');R_(sx+4,y+16,20,24,'#e8841a');R_(sx+4,y+26,20,3,'#ffe36b');E_(sx+14,y+11,8,8,'#e0b088');E_(sx+14,y+6,10,5,'#ffd23f');R_(sx+4,y+7,20,3,'#ffd23f');EY(sx+10,y+12,1.8);R_(sx-4,y+18,8,6,'#7a4a24')}},
 bulldog:{n:'Bulldog',w:44,h:28,s:210,dr:(sx,y,o)=>{const a=Math.sin(o.ph*18)*5;R_(sx+12+a,y+22,5,7,'#8a6238');R_(sx+32-a,y+22,5,7,'#8a6238');E_(sx+26,y+15,17,10,'#b98b5a');E_(sx+10,y+13,10,9,'#c99b6a');E_(sx+4,y+17,6,5,'#a57848');E_(sx+8,y+6,4,5,'#7a5230');R_(sx+14,y+20,6,3,'#c22');EY(sx+8,y+11,2.2);E_(sx+1,y+15,2.5,2,'#222');R_(sx+3,y+19,3,3,'#fff')}},
 skater:{n:'Skater',w:30,h:40,s:340,dr:(sx,y,o)=>{R_(sx,y+35,30,4,'#e63');E_(sx+6,y+39,3,3,'#fff');E_(sx+24,y+39,3,3,'#fff');R_(sx+8,y+20,6,15,'#335');R_(sx+17,y+20,6,15,'#335');R_(sx+6,y+8,19,14,'#7b3fe0');E_(sx+15,y+5,6,6,'#e0b088');R_(sx+8,y,15,4,'#222');R_(sx+2,y+10+Math.sin(o.ph*6)*2,5,3,'#7b3fe0');EY(sx+13,y+5,1.6)}},
 beachball:{n:'Beach Ball',w:30,h:30,s:140,st:o=>{o.y=G-30-Math.abs(Math.sin(o.ph*3))*60},dr:(sx,y,o)=>{x.save();x.translate(sx+15,y+15);x.rotate(-o.ph*5);const cs=['#f33','#fff','#39f','#fd2','#3c6','#fff'];for(let i=0;i<6;i++){x.fillStyle=cs[i];x.beginPath();x.moveTo(0,0);x.arc(0,0,15,i*Math.PI/3,(i+1)*Math.PI/3);x.fill()}x.restore();E_(sx+10,y+9,4,3,'rgba(255,255,255,.4)')}},
 slime:{n:'Slime',w:44,h:24,s:70,dr:(sx,y,o)=>{const q=Math.sin(o.ph*6)*3;x.fillStyle='#6fe06a';x.beginPath();x.moveTo(sx,y+24);x.quadraticCurveTo(sx+2,y+2-q,sx+22,y+2-q);x.quadraticCurveTo(sx+42,y+2-q,sx+44,y+24);x.fill();EY(sx+14,y+12,4);EY(sx+28,y+12,4);R_(sx+17,y+19,10,2,'#2a7a28');E_(sx+10,y+8,4,2,'rgba(255,255,255,.5)')}},
 frog:{n:'Frog',w:30,h:24,s:100,st:(o,dt)=>{const c=o.ph%1.6;if(c<.55){o.y=G-24-Math.sin(c/.55*Math.PI)*80;o.x-=160*dt}else o.y=G-24},dr:(sx,y,o)=>{const up=y<G-26;E_(sx+16,y+15,13,8,'#4cc24a');E_(sx+6,y+10,7,6,'#58d055');E_(sx+4,y+5,4,4,'#fff');E_(sx+11,y+4,4,4,'#fff');E_(sx+4,y+5,2,2,'#111');E_(sx+11,y+4,2,2,'#111');R_(sx+20,y+19,8,up?3:5,'#3a9a38');R_(sx+2,y+19,6,5,'#3a9a38');R_(sx+1,y+13,6,2,'#c33')}},
 skeleton:{n:'Skeleton',w:26,h:54,s:120,dr:(sx,y,o)=>{const a=Math.sin(o.ph*7)*5;x.strokeStyle='#eee';x.lineWidth=3;x.beginPath();x.moveTo(sx+10,y+38);x.lineTo(sx+10+a,y+54);x.moveTo(sx+16,y+38);x.lineTo(sx+16-a,y+54);x.moveTo(sx+13,y+18);x.lineTo(sx+13,y+38);x.stroke();x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();x.moveTo(sx+6,y+21+i*5);x.lineTo(sx+20,y+21+i*5);x.stroke()}E_(sx+13,y+10,8,8,'#f2f2ea');R_(sx+5,y+3,16,4,'#c22');E_(sx+10,y+10,2,2,'#111');E_(sx+16,y+10,2,2,'#111');R_(sx+9,y+15,8,2,'#aaa');x.strokeStyle='#bbb';x.lineWidth=3;x.beginPath();x.moveTo(sx+2,y+26);x.lineTo(sx-8,y+10);x.stroke()}},
 ghost:{n:'Ghost',w:32,h:36,s:130,st:o=>{o.y=G-44-(Math.sin(o.ph*3)*14+14)},dr:(sx,y,o)=>{x.globalAlpha=.8;x.fillStyle='#e8f0ff';x.beginPath();x.moveTo(sx,y+36);x.lineTo(sx,y+14);x.quadraticCurveTo(sx+16,y-8,sx+32,y+14);x.lineTo(sx+32,y+36);for(let i=0;i<4;i++)x.quadraticCurveTo(sx+28-i*8,y+30+(i%2?4:-2)+Math.sin(o.ph*8+i)*2,sx+24-i*8,y+36);x.fill();x.globalAlpha=1;E_(sx+11,y+14,3,4,'#223');E_(sx+21,y+14,3,4,'#223');E_(sx+16,y+23,3,4,'#223')}},
 pelican:{n:'Pelican',w:54,h:26,s:150,y0:G-64,dr:(sx,y,o)=>{const f=Math.sin(o.ph*7)*9;E_(sx+34,y+14,16,8,'#f4f4f4');E_(sx+14,y+10,7,6,'#f4f4f4');x.fillStyle='#f9a826';x.beginPath();x.moveTo(sx+8,y+8);x.lineTo(sx-12,y+14);x.lineTo(sx+8,y+22);x.fill();x.fillStyle='#e0e0e8';x.beginPath();x.moveTo(sx+30,y+10);x.lineTo(sx+40,y-10+f);x.lineTo(sx+50,y+10);x.fill();EY(sx+12,y+8,2);R_(sx+48,y+12,10,3,'#ddd')}},
 bat:{n:'Bat',w:30,h:18,s:200,y0:G-80,st:o=>{o.y=G-80+Math.sin(o.ph*7)*34},dr:(sx,y,o)=>{const f=Math.sin(o.ph*18)*8;x.fillStyle='#3a2a52';x.beginPath();x.moveTo(sx+15,y+8);x.quadraticCurveTo(sx+4,y-6-f,sx-6,y+4-f);x.quadraticCurveTo(sx+2,y+8,sx+6,y+14);x.lineTo(sx+15,y+12);x.lineTo(sx+24,y+14);x.quadraticCurveTo(sx+28,y+8,sx+36,y+4-f);x.quadraticCurveTo(sx+26,y-6-f,sx+15,y+8);x.fill();E_(sx+15,y+9,5,5,'#4a3a66');R_(sx+11,y+3,2,4,'#4a3a66');R_(sx+17,y+3,2,4,'#4a3a66');R_(sx+12,y+8,2,2,'#f44');R_(sx+17,y+8,2,2,'#f44')}},
 drone:{n:'Drone',w:34,h:20,s:120,y0:G-60,st:o=>{o.y=G-60+Math.sin(o.ph*3)*4},dr:(sx,y,o)=>{R_(sx+6,y+6,22,9,'#555a66');R_(sx+4,y+2,6,2,'#999');R_(sx+24,y+2,6,2,'#999');x.fillStyle='rgba(200,220,255,.5)';x.fillRect(sx-4,y+1,16,2);x.fillRect(sx+22,y+1,16,2);R_(sx+8,y+3,2,4,'#333');R_(sx+24,y+3,2,4,'#333');const on=Math.sin(o.ph*8)>0;E_(sx+17,y+16,4,4,on?'#f33':'#611');if(on){x.fillStyle='rgba(255,50,50,.25)';x.beginPath();x.arc(sx+17,y+16,12,0,7);x.fill()}}},
 crow:{n:'Crow',w:36,h:20,s:230,y0:G-170,st:(o,dt,sx)=>{o.y=G-60-Math.max(0,Math.min(1,(sx-300)/250))*110},dr:(sx,y,o)=>{const f=Math.sin(o.ph*14)*8;E_(sx+20,y+11,13,6,'#16161e');E_(sx+8,y+9,6,5,'#16161e');x.fillStyle='#e8a23a';x.beginPath();x.moveTo(sx+3,y+8);x.lineTo(sx-6,y+11);x.lineTo(sx+3,y+13);x.fill();x.fillStyle='#22222c';x.beginPath();x.moveTo(sx+16,y+9);x.lineTo(sx+26,y-8+f);x.lineTo(sx+32,y+10);x.fill();R_(sx+30,y+9,9,4,'#16161e');R_(sx+7,y+7,2,2,'#fff')}},
 fish:{n:'Flying Fish',w:32,h:16,s:220,y0:G-62,st:o=>{o.y=G-62+Math.sin(o.ph*5)*30},dr:(sx,y,o)=>{const f=Math.sin(o.ph*16)*5;E_(sx+16,y+9,14,5,'#6bb7e8');E_(sx+14,y+11,10,3,'#cde8f8');x.fillStyle='#9ad4f5';x.beginPath();x.moveTo(sx+14,y+7);x.lineTo(sx+22,y-6+f);x.lineTo(sx+24,y+7);x.fill();x.fillStyle='#4a97cc';x.beginPath();x.moveTo(sx+29,y+9);x.lineTo(sx+38,y+2);x.lineTo(sx+38,y+16);x.fill();EY(sx+6,y+8,2)}},
 cannon:{n:'Cannonball',w:22,h:22,s:420,dr:(sx,y,o)=>{x.fillStyle='rgba(255,170,60,.35)';x.beginPath();x.moveTo(sx+22,y+4);x.lineTo(sx+60,y+11);x.lineTo(sx+22,y+18);x.fill();E_(sx+11,y+11,11,11,'#23232b');E_(sx+7,y+7,3,3,'#667');R_(sx+11,y-3,2,5,'#a73');if(Math.sin(o.ph*40)>0)E_(sx+12,y-4,3,3,'#ffd23f')}},
 turtle:{n:'Turtle',w:46,h:26,s:60,dr:(sx,y,o)=>{const a=Math.sin(o.ph*5)*2;E_(sx+5,y+16,6,5,'#8fb85a');R_(sx+10+a,y+20,6,6,'#6f9a3f');R_(sx+32-a,y+20,6,6,'#6f9a3f');x.fillStyle='#3f8a46';x.beginPath();x.moveTo(sx+10,y+22);x.quadraticCurveTo(sx+24,y-8,sx+42,y+22);x.fill();x.strokeStyle='#2c6a34';x.lineWidth=2;x.beginPath();x.moveTo(sx+18,y+8);x.lineTo(sx+22,y+22);x.moveTo(sx+28,y+6);x.lineTo(sx+28,y+22);x.moveTo(sx+36,y+10);x.lineTo(sx+32,y+22);x.stroke();EY(sx+4,y+14,2)}},
 parrot:{n:'Parrot',w:34,h:24,s:190,y0:G-58,st:o=>{o.y=G-58+Math.sin(o.ph*4)*8},dr:(sx,y,o)=>{const f=Math.sin(o.ph*9)*7;E_(sx+20,y+12,12,7,'#e83b3b');E_(sx+8,y+9,7,6,'#e83b3b');x.fillStyle='#ffd23f';x.beginPath();x.moveTo(sx+2,y+6);x.lineTo(sx-5,y+11);x.lineTo(sx+3,y+13);x.fill();x.fillStyle='#2a8cf0';x.beginPath();x.moveTo(sx+16,y+9);x.lineTo(sx+26,y-6+f);x.lineTo(sx+30,y+11);x.fill();x.fillStyle='#3cc060';x.fillRect(sx+30,y+10,9,4);x.fillRect(sx+33,y+14,7,3);EY(sx+7,y+7,2)}},
 ninja:{n:'Ninja Cat',w:28,h:28,s:120,st:(o,dt,sx)=>{if(sx<520)o.go=1;if(o.go){o.x-=300*dt;o.lp=(o.lp||0)+dt;o.y=G-28-(o.lp<.5?Math.sin(o.lp/.5*Math.PI)*90:0)}},dr:(sx,y,o)=>{x.strokeStyle='#222';x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(sx+24,y+20);x.quadraticCurveTo(sx+36,y+14+Math.sin(o.ph*12)*3,sx+32,y+4);x.stroke();x.lineCap='butt';E_(sx+14,y+18,11,8,'#23232b');E_(sx+8,y+11,9,8,'#2c2c36');x.fillStyle='#2c2c36';x.beginPath();x.moveTo(sx+1,y+6);x.lineTo(sx+3,y-3);x.lineTo(sx+8,y+3);x.fill();x.beginPath();x.moveTo(sx+10,y+3);x.lineTo(sx+15,y-3);x.lineTo(sx+16,y+6);x.fill();R_(sx,y+9,18,3,'#d22');R_(sx+14,y+9,8,2,'#d22');E_(sx+5,y+13,2.2,1.6,'#fff');E_(sx+11,y+13,2.2,1.6,'#fff');R_(sx+9+Math.sin(o.ph*20)*2,y+25,5,3,'#23232b')}},
 robot:{n:'Security Bot',w:34,h:42,s:170,dr:(sx,y,o)=>{E_(sx+17,y+37,8,5,'#222');R_(sx+5,y+14,24,22,'#9aa4b4');R_(sx+9,y+19,16,7,'#222');const on=Math.sin(o.ph*10)>0;R_(sx+10,y+21,on?12:6,3,'#f33');R_(sx+14,y+8,6,6,'#778');E_(sx+17,y+6,5,4,on?'#f33':'#37f');x.fillStyle=on?'rgba(255,60,60,.25)':'rgba(60,120,255,.25)';x.beginPath();x.arc(sx+17,y+6,14,0,7);x.fill();R_(sx-3,y+22,8,3,'#778');R_(sx+29,y+22,8,3,'#778');R_(sx+7,y+30,20,2,'#667')}}
};
// which of the 20 appear on each of the 30 maps (themed)
const ENP=[['crab','rat'],['crab','pelican','docker'],['skater','drone'],['rat','docker','bulldog'],['pelican','crow'],['frog','rat','slime'],['robot','docker','cannon'],['crab','fish','turtle'],['frog','bat','ghost'],['beachball','skater','parrot'],['bulldog','pelican','beachball'],['crow','pelican','parrot'],['ghost','bat'],['skeleton','parrot','cannon'],['robot','drone','crow'],['ninja','bulldog','beachball'],['slime','bulldog','crow','rat'],['turtle','ninja','bat'],['ghost','drone','fish'],['skeleton','bat','cannon'],['slime','robot','ninja'],['frog','turtle','fish'],['ninja','skater','parrot'],['turtle','rat','bulldog'],['bat','ghost','drone'],['skeleton','ghost','bat'],['robot','cannon','crow'],['frog','docker','fish'],['ninja','drone','skeleton'],Object.keys(EN)];
ENP.push(['rat','bulldog','crow','frog'],['bulldog','crow','skater'],['frog','turtle','fish'],['bat','rat','ninja'],['crow','cannon','bulldog'],['crab','rat','turtle'],['skeleton','ghost','bat'],['bat','ghost','frog'],['ninja','parrot','docker'],['ghost','beachball','skater','drone'],['fish','frog','ninja'],['ninja','frog','crow'],['skeleton','bat','robot'],['skeleton','bat','cannon','ghost'],['robot','docker','crow'],['robot','docker','slime'],['drone','robot','bat'],['robot','cannon','skater'],['slime','drone','robot','ghost'],['fish','turtle','crab'],['skeleton','crab','ghost'],['fish','ghost','slime'],['crab','fish','turtle','parrot'],['bulldog','crow','rat','ninja'],['bat','ghost','ninja'],['drone','fish','crow'],['robot','cannon','crow','bat'],['fish','cannon','pelican','parrot'],['drone','robot','ninja','skater'],Object.keys(EN));
function mkEn(ks,xw){const k=ks[(Math.random()*ks.length)|0],E=EN[k];return{t:'en',k,x:xw,y:E.y0!==undefined?E.y0:G-E.h,ph:rnd(0,6)}}
function isEn(o){return o.t=='cop'||o.t=='barrel'||o.t=='gull'||o.t=='en'}
function ebox(o,sx){if(o.t=='cop')return[sx+4,G-56,24,56];if(o.t=='barrel')return[sx,G-34,34,34];if(o.t=='gull'){const gy=o.y+Math.sin(o.ph*.4)*6;return[sx,gy,36,22]}const E=EN[o.k];return[sx,o.y,E.w,E.h]}
function knock(o,sx,b){o.dead=1;o.fy=0;o.vx=v+rnd(320,520);o.vy=-rnd(300,520);o.rot=0;o.vr=rnd(9,18);o.pvx=b[0]+b[2]/2-sx;o.pvy=b[1]+b[3]/2;loot+=2;shake=Math.max(shake,.12);
 const cx=b[0]+b[2]/2,cy=b[1]+b[3]/2;burst(cx,cy,'#ffd23f',14);burst(cx,cy,'#fff',8);rings.push({x:cx,y:cy,r:6,l:.35});pops.push({x:o.x,y:b[1]-6,t:'+2',l:.8,col:'#ffd23f'})}
function spin(){if(S!='play'||P.spin>0||P.scd>0||P.fall||!P.alive)return;P.spin=.45;P.scd=1.3;P.slide=0;rings.push({x:190,y:P.y+P.h/2,r:20,l:.45});rings.push({x:190,y:P.y+P.h/2,r:44,l:.35});burst(190,P.y+P.h/2,'#fff',14)}
function spinBtn(){const bx=W-78,by=H-72,r=38,rd=P.scd>0?1-P.scd/1.3:1,rdy=rd>=1;
 x.save();x.fillStyle='rgba(8,6,24,.6)';x.beginPath();x.arc(bx,by,r,0,7);x.fill();
 if(rdy){x.strokeStyle='rgba(255,210,63,'+(.25+.2*Math.sin(t*6))+')';x.lineWidth=8;x.beginPath();x.arc(bx,by,r+3,0,7);x.stroke()}
 x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=4;x.beginPath();x.arc(bx,by,r-2,0,7);x.stroke();
 x.strokeStyle=rdy?'#ffd23f':'#9ad';x.lineWidth=5;x.beginPath();x.arc(bx,by,r-2,-Math.PI/2,-Math.PI/2+rd*Math.PI*2);x.stroke();
 x.translate(bx,by);x.rotate(P.spin>0?t*20:0);x.strokeStyle=x.fillStyle=rdy?'#fff':'#789';x.lineWidth=4;x.lineCap='round';
 for(let i=0;i<2;i++){const a0=i*Math.PI+.3,a1=a0+2.1;x.beginPath();x.arc(0,0,14,a0,a1);x.stroke();const nx=Math.cos(a1),ny=Math.sin(a1),px=nx*14,py=ny*14;x.beginPath();x.moveTo(px-ny*8,py+nx*8);x.lineTo(px+nx*6,py+ny*6);x.lineTo(px+ny*2,py-nx*2);x.fill()}
 x.restore();x.textAlign='center';x.font='bold 12px system-ui,sans-serif';x.fillStyle=rdy?'#ffd23f':'#9ad';x.fillText('SPIN [X]',bx,by+r+16)}
const birds=Array.from({length:5},()=>({x:rnd(0,W),y:rnd(60,200),p:rnd(0,6),s:rnd(.6,1)}));
const skyline=Array.from({length:40},(_,i)=>({x:i*70,w:rnd(40,66),h:rnd(60,170),win:Array.from({length:14},()=>Math.random()<.45)}));
const boats=Array.from({length:6},(_,i)=>({x:i*420,s:rnd(.8,1.3)}));
function reset(){dist=cp*LEN;base=dist;lvl=cp;v=SPD(lvl);loot=0;objs=[];parts=[];pops=[];rings=[];trail=[];sq=0;dflash=0;celeb=0;conf=[];fw=[];spk=[];nextX=_p=dist+900;shake=0;banner=3;flash=0;
P={y:G-56,vy:0,h:56,jumps:0,slide:0,alive:true,fall:false,run:0,spin:0,scd:0}}
function inGap(wx){return objs.some(o=>o.t=='gap'&&wx>o.x+8&&wx<o.x+o.w-8)}
function spawn(){
 while(nextX<dist+1600){nextX=_p+(nextX-_p)*Math.max(1,v/440)*(1.3-Math.min(lvl,29)/29*.3)*DF[diff].sp;_p=nextX;
  const r=Math.random(),d=Math.min(lvl,29)/29;let o=nextX;if(Math.random()<(.3+d*.2+(lvl>29?.04:0))*DF[diff].haz){hazard(o);continue}
  if(r<.28){objs.push({t:'crate',x:o,w:44,h:44+(Math.random()<.3?30:0)});nextX+=rnd(420,620)-d*100}
  else if(r<.5){const w=rnd(130,190)+d*50;objs.push({t:'gap',x:o,w});
   for(let i=0;i<6;i++)objs.push({t:'coin',x:o+w*(i/5)-10,y:G-90-Math.sin(i/5*Math.PI)*90});nextX+=w+rnd(380,520)}
  else if(r<.72){objs.push({t:'gull',x:o,y:G-58,ph:rnd(0,6)});nextX+=rnd(420,560)}
  else if(r<.86){for(let i=0;i<7;i++)objs.push({t:'coin',x:o+i*34,y:G-40-(i%2?10:0)});nextX+=rnd(380,500)}
  else{objs.push({t:'gem',x:o,y:G-150});objs.push({t:'crate',x:o-10,w:44,h:44});nextX+=rnd(460,600)}
 }}
function burst(px,py,col,n){for(let i=0;i<n;i++)parts.push({x:px,y:py,vx:rnd(-160,160),vy:rnd(-220,60),l:rnd(.3,.7),col,s:rnd(2,4)})}
function jump(){
 if(S!='play'){if(S=='title'||(S=='over'||S=='win')&&t>.6){reset();S='play';t=0}return}
 if(P.jumps<2&&!P.fall){P.vy=P.jumps?-560:-640;P.jumps++;P.slide=0;burst(200,P.y+P.h,'#9ad',8);sq=-.7;rings.push({x:200,y:P.y+P.h,r:6,l:.4})}}
function slide(){if(S=='play'&&!P.fall){if(P.y+P.h>=G-1){P.slide=.7;P.h=28;P.y=G-28}else P.vy=Math.max(P.vy,700)}}
addEventListener('keydown',e=>{if(S=='gallery'){galKey(e);return}if(e.code=='KeyG'&&S!='play'){e.preventDefault();openGal();return}if(e.code=='KeyC'&&S!='play'){setCh(who+1);return}if(['KeyX','KeyZ','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();if(!e.repeat)spin();return}if(S!='play'&&['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code)){e.preventDefault();diff=Math.max(0,Math.min(2,diff+(e.code=='ArrowLeft'||e.code=='KeyA'?-1:1)));return}
 if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(!e.repeat)jump()}
 if(['ArrowDown','KeyS'].includes(e.code)){e.preventDefault();slide()}});
c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();
 if(S=='intro'){S='title';t=0;return}
 if(S=='gallery'){galClick(e,r);return}if(S!='play'&&galHit(e,r)){openGal();return}
 if(S=='play'){const bx=(e.clientX-r.left)/r.width*W-(W-78),by=(e.clientY-r.top)/r.height*H-(H-72);if(bx*bx+by*by<3600){spin();return}}
 if(S=='title'){const cx=(e.clientX-r.left)/r.width*W,cy=(e.clientY-r.top)/r.height*H;if(cy>=252&&cy<366&&cx>=W/2-222&&cx<W/2+222){const col=Math.floor((cx-(W/2-222))/148),row=Math.floor((cy-254)/39),idx=row*3+col;if(col<3&&row<3&&idx<CH.length){setCh(idx);return}}if(cy>372&&cy<408&&Math.abs(cx-W/2)<255){diff=Math.max(0,Math.min(2,Math.round((cx-W/2)/170)+1));return}}
 (e.clientX-r.left<r.width*.6||S!='play')?jump():slide()});
function die(f){cp=lvl;P.alive=false;S='over';t=0;shake=.4;burst(200,P.y+30,'#f55',30);dflash=1;celeb=0;conf=[];fw=[];spk=[];
 if(sc()>hi){hi=sc();try{localStorage.setItem('bb2',hi)}catch(e){}}}
function update(dt){
 t+=dt;if(S=='intro'){introT+=dt;if(introT>=15){introT=15;S='title';t=0}}shake=Math.max(0,shake-dt);banner=Math.max(0,banner-dt);flash=Math.max(0,flash-dt*1.5);bump=Math.max(0,bump-dt*4);dflash=Math.max(0,dflash-dt*.8);sq+=(0-sq)*Math.min(1,dt*10);
 if(S=='play'){
  v+=(SPD(lvl)-v)*dt;dist+=v*dt;spawn();
  const nl=Math.floor(dist/LEN);
  if(nl>lvl){if(nl>=NM){mark(NM-1);awardTrash(NM-1);S='win';t=0;cp=0;const s=sc();if(s>hi){hi=s;try{localStorage.setItem('bb2',hi)}catch(e){}}burst(200,P.y,'#ffd23f',40);celebrate(NM);return}
   mark(nl-1);awardTrash(nl-1);lvl=nl;banner=5;flash=1;loot+=10;celebrate(nl);burst(200,P.y,'#ffd23f',30)}
  P.slide=Math.max(0,P.slide-dt);P.spin=Math.max(0,P.spin-dt);P.scd=Math.max(0,P.scd-dt);if(P.spin>0)P.slide=0;P.h=P.slide>0?28:56;P.run+=dt*v/38;
  P.vy+=1700*dt*(P.spin>0?.4:1);P.y+=P.vy*dt;
  const cx=dist+200;
  if(!P.fall&&P.vy>=0&&P.y+P.h>=G&&P.y+P.h<G+30&&!inGap(cx)){if(P.vy>260){sq=Math.min(1,P.vy/800);for(let i=0;i<9;i++)parts.push({x:190+rnd(-12,12),y:G-2,vx:rnd(-200,40),vy:rnd(-80,-10),l:rnd(.3,.5),col:'#cdb48a',s:rnd(2,4)});rings.push({x:190,y:G,r:8,l:.35})}P.y=G-P.h;P.vy=0;P.jumps=0}
  else if(P.y+P.h>G+10&&inGap(cx)&&!P.fall){P.fall=true;burst(200,G,'#6cf',20);rings.push({x:200,y:G+8,r:8,l:.8});rings.push({x:200,y:G+8,r:2,l:.6})}
  if(P.y+P.h<G-6&&!P.fall)trail.push({y:P.y,h:P.h,d:dist,l:.25});if(P.y>H+40)die();
  const px=175,pw=30,py=P.y+6,ph=P.h-6;
  for(const o of objs){const sx=o.x-dist;if(sx<-300||sx>W+50)continue;
   if(o.dead){o.x+=o.vx*dt;o.fy+=o.vy*dt;o.vy+=900*dt;o.rot+=o.vr*dt;continue}
   if(P.spin>0&&isEn(o)){const b=ebox(o,sx),cx0=px+pw/2,cy0=py+ph/2,nx=Math.max(b[0],Math.min(cx0,b[0]+b[2])),ny=Math.max(b[1],Math.min(cy0,b[1]+b[3]));if((nx-cx0)*(nx-cx0)+(ny-cy0)*(ny-cy0)<4356){knock(o,sx,b);continue}}
   if(o.t=='en'){const E=EN[o.k];o.ph+=dt;o.x-=E.s*dt;if(E.st)E.st(o,dt,sx);if(px+pw>sx+4&&px<sx+E.w-4&&py<o.y+E.h-3&&py+ph>o.y+3)die()}
   if(o.t=='cop'||o.t=='barrel'){o.x-=(o.t=='cop'?150:260)*dt;o.ph+=dt*(o.t=='cop'?8:9)}
   if(o.t=='cop'&&px+pw>sx+6&&px<sx+28&&py+ph>G-58)die();
   if(o.t=='barrel'&&px+pw>sx+4&&px<sx+30&&py+ph>G-32)die();
   if(o.t=='hang'&&px+pw>sx+6&&px<sx+28&&py<G-42)die();
   if(o.t=='spout'){const sp=(t+o.off)%2.4;if(sp>1.7&&px+pw>sx+6&&px<sx+30&&py+ph>G-76)die()}
   if(o.t=='crate'&&px+pw>sx+4&&px<sx+o.w-4&&py+ph>G-o.h+4){die()}
   if(o.t=='gull'){o.ph+=dt*8;const gx=sx-dt*0,gy=o.y+Math.sin(o.ph*.4)*6;
    if(px+pw>gx&&px<gx+36&&py<gy+22&&py+ph>gy)die()}
   if((o.t=='coin'||o.t=='gem')&&!o.got&&Math.abs(sx+8-(px+20))<26&&Math.abs(o.y-(py+ph/2))<34){
    o.got=1;loot+=o.t=='gem'?5:1;pops.push({x:o.x,y:o.y-14,t:o.t=='gem'?'+5':'+1',l:.8,col:o.t=='gem'?'#f8f':'#fd4'});burst(sx,o.y,o.t=='gem'?'#f8f':'#fd4',10)}}
  objs=objs.filter(o=>o.x-dist>-300&&!(o.dead&&(o.x-dist>W+60||o.fy>560)));
  if(P.alive&&Math.random()<.5)parts.push({x:170,y:Math.min(P.y+P.h,G),vx:-v*.3,vy:rnd(-40,0),l:.3,col:'#8a7',s:2})
 }
 for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.l-=dt}for(const p of pops){p.y-=36*dt;p.l-=dt}for(const r of rings){r.r+=110*dt;r.l-=dt}for(const q of trail)q.l-=dt;
 celeb=Math.max(0,celeb-dt);trashToast=Math.max(0,trashToast-dt);
 if(S=='win'){if(Math.random()<.05)fw.push({x:rnd(100,W-100),y:H,ty:rnd(80,260),d:0,vy:-520,c:rnd(0,360)});if(Math.random()<.5)conf.push({x:rnd(0,W),y:-10,vx:rnd(-60,60),vy:rnd(120,300),r:rnd(0,6),vr:rnd(-8,8),w:rnd(6,11),h:rnd(4,8),c:hs(rnd(0,360),90,60),l:5})}
 for(const f of fw){if(f.d>0){f.d-=dt;continue}f.y+=f.vy*dt;if(Math.random()<.8)spk.push({x:f.x,y:f.y,vx:rnd(-10,10),vy:rnd(0,30),l:.3,c:f.c,s:2});
  if(f.y<=f.ty){f.done=1;for(let i=0;i<46;i++){const a=i/46*6.283,sp=rnd(90,230);spk.push({x:f.x,y:f.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:rnd(.8,1.4),c:f.c+rnd(-20,20),s:3})}}}
 fw=fw.filter(f=>!f.done);
 for(const s of spk){s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=160*dt;s.vx*=.99;s.l-=dt}
 spk=spk.filter(s=>s.l>0);
 for(const c of conf){c.x+=c.vx*dt+Math.sin(t*3+c.r)*20*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;c.l-=dt}
 conf=conf.filter(c=>c.l>0&&c.y<H+20);
 parts=parts.filter(p=>p.l>0);pops=pops.filter(p=>p.l>0);rings=rings.filter(r=>r.l>0);trail=trail.filter(q=>q.l>0);
}
function sky(){
 let g=x.createLinearGradient(0,0,0,G);const L=M[4];g.addColorStop(0,hs(M[1],55,6+L*38));g.addColorStop(.55,hs((M[1]+M[2])/2,50,16+L*38));g.addColorStop(.85,hs(M[2],65,32+L*34));g.addColorStop(1,hs(M[2],90,52+L*28));
 x.fillStyle=g;x.fillRect(0,0,W,H);
 // aurora ribbons (Aurora Bay)
 if(lvl==18||lvl==54||lvl==55){for(let i=0;i<3;i++){let a=x.createLinearGradient(0,60,0,230);a.addColorStop(0,'rgba(80,255,170,0)');a.addColorStop(.5,'hsla('+(140+i*50+Math.sin(t+i)*20)+',90%,60%,.22)');a.addColorStop(1,'rgba(80,255,170,0)');x.fillStyle=a;x.beginPath();x.moveTo(0,120);for(let px=0;px<=W;px+=40)x.lineTo(px,110+i*28+Math.sin(px*.012+t*.8+i*2)*30);x.lineTo(W,260);x.lineTo(0,260);x.fill()}}
 for(const s of stars){x.globalAlpha=(.5+.5*Math.sin(t*2+s.p))*Math.max(0,1-M[4]*1.3);x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}
 x.globalAlpha=1;
 // shooting stars
 if(L<.5){if(!shoot&&Math.random()<.006)shoot={x:rnd(300,W),y:rnd(10,110),l:1};
  if(shoot){x.globalAlpha=Math.max(0,shoot.l);let sg=x.createLinearGradient(shoot.x,shoot.y,shoot.x+90,shoot.y-40);sg.addColorStop(0,'#fff');sg.addColorStop(1,'rgba(255,255,255,0)');x.strokeStyle=sg;x.lineWidth=2;x.beginPath();x.moveTo(shoot.x,shoot.y);x.lineTo(shoot.x+90,shoot.y-40);x.stroke();shoot.x-=10;shoot.y+=4.5;shoot.l-=.03;x.globalAlpha=1;if(shoot.l<=0)shoot=null}}
 // sun (day) or moon (night)
 const sx0=760,sy0=110;
 let m=x.createRadialGradient(sx0,sy0,10,sx0,sy0,170);m.addColorStop(0,L>.55?'rgba(255,230,150,.7)':'rgba(255,245,210,.55)');m.addColorStop(1,'rgba(255,245,210,0)');
 x.fillStyle=m;x.fillRect(560,0,400,320);
 if(L>.55){x.save();x.translate(sx0,sy0);x.rotate(t*.1);x.fillStyle='rgba(255,230,130,.35)';for(let i=0;i<12;i++){x.rotate(Math.PI/6);x.beginPath();x.moveTo(-8,-46);x.lineTo(0,-86-(i%2)*14);x.lineTo(8,-46);x.fill()}x.restore();x.fillStyle='#fff2b0';x.beginPath();x.arc(sx0,sy0,38,0,7);x.fill()}
 else{x.fillStyle='#fff6d8';x.beginPath();x.arc(sx0,sy0,38,0,7);x.fill();
  x.fillStyle='#e6dcb8';[[748,100,8],[772,125,6],[768,92,4]].forEach(a=>{x.beginPath();x.arc(a[0],a[1],a[2],0,7);x.fill()})}
 // drifting clouds
 for(const c of clouds){const cx=((c.x-t*c.sp*20-dist*.03)%(W+400)+(W+400))%(W+400)-200;
  x.fillStyle='hsla('+(M[1]%360)+',35%,'+(18+L*68)+'%,'+(.22+L*.3)+')';
  for(const q of[[0,0,26],[28,-8,32],[58,0,24],[28,8,26]]){x.beginPath();x.ellipse(cx+q[0]*c.s,c.y+q[1]*c.s,q[2]*c.s*1.3,q[2]*c.s*.6,0,0,7);x.fill()}}
 // distant birds
 if(L>=.1){x.strokeStyle='rgba(20,20,40,.55)';x.lineWidth=2;for(const b of birds){const bx=((b.x-t*30*b.s-dist*.05)%1100+1100)%1100-70,by=b.y+Math.sin(t+b.p)*10,fl=Math.sin(t*8+b.p)*5;x.beginPath();x.moveTo(bx-9,by-fl);x.quadraticCurveTo(bx-4,by+2,bx,by);x.quadraticCurveTo(bx+4,by+2,bx+9,by-fl);x.stroke()}}
}
function city0(){
 const off=(dist*.08)%2800;
 for(const b of skyline){let bx=((b.x-off)%2800+2800)%2800-200;if(bx>W)continue;
  x.fillStyle=hs(M[1],45,9+M[4]*16);x.fillRect(bx,G-60-b.h,b.w,b.h+60);
  b.win.forEach((w,i)=>{if(w&&M[4]<.6){x.fillStyle=(i%5==0)?'#ffcf7a':'#f2a65a';x.fillRect(bx+6+(i%4)*12,G-52-b.h+Math.floor(i/4)*16,6,8)}})}
 // lighthouse
 const lx=((620-dist*.12)%1800+1800)%1800-100;
 if(lx<W+100){x.fillStyle=hs(M[1],45,7+M[4]*12);x.beginPath();x.moveTo(lx,G-60);x.lineTo(lx+14,G-260);x.lineTo(lx+36,G-260);x.lineTo(lx+50,G-60);x.fill();
  x.fillStyle='#ffe08a';x.fillRect(lx+16,G-278,18,18);
  const a=Math.sin(t*1.2)*.5;x.save();x.translate(lx+25,G-269);x.rotate(a-.3);
  let bm=x.createLinearGradient(0,0,-420,0);bm.addColorStop(0,'rgba(255,240,170,.35)');bm.addColorStop(1,'rgba(255,240,170,0)');
  x.fillStyle=bm;x.beginPath();x.moveTo(0,0);x.lineTo(-420,-40);x.lineTo(-420,40);x.fill();x.restore()}
}
function city(){if(M[5])cityAlt(M[5]);else city0();const h=(M[2]%360+360)%360;let z=x.createLinearGradient(0,G-150,0,G);z.addColorStop(0,'hsla('+h+',70%,55%,0)');z.addColorStop(1,'hsla('+h+',70%,'+(40+M[4]*30)+'%,.3)');x.fillStyle=z;x.fillRect(0,G-150,W,150)}
function water0(){
 let g=x.createLinearGradient(0,G,0,H);g.addColorStop(0,hs(M[1],50,15+M[4]*16));g.addColorStop(1,hs(M[1],60,3+M[4]*6));x.fillStyle=g;x.fillRect(0,G,W,H-G);
 for(const b of boats){const bx=((b.x-dist*.25)%2520+2520)%2520-200;
  x.save();x.translate(bx,G-6);x.scale(b.s,b.s);x.fillStyle=hs(M[1],40,7+M[4]*10);x.beginPath();x.moveTo(-40,-14);x.lineTo(40,-14);x.lineTo(28,6);x.lineTo(-30,6);x.fill();
  x.fillRect(-2,-70,3,56);x.beginPath();x.moveTo(3,-68);x.lineTo(32,-20);x.lineTo(3,-20);x.fill();
  x.fillStyle='rgba(255,200,120,.25)';x.fillRect(-18,12,36,60);x.restore()}
 x.fillStyle='rgba(255,210,150,.18)';
 for(let i=0;i<14;i++){const wx=((i*90-dist*.4)%1260+1260)%1260-150,wy=G+14+(i*37)%90;x.fillRect(wx,wy+Math.sin(t*2+i)*2,50-(i%3)*12,2)}
}
function water(){water0();
 const L=M[4];
 for(let i=0;i<14;i++){const w=(46-i*2.6)*(.65+.35*Math.sin(t*3+i)),yy=G+36+i*8;if(yy>H)break;x.fillStyle=(L>.55?'rgba(255,230,150,':'rgba(255,245,210,')+(.32-i*.02)+')';x.fillRect(760-w/2+Math.sin(t*2+i)*5,yy,w,2.5)}
 x.strokeStyle='rgba(255,255,255,.13)';x.lineWidth=2;for(const by of[G+44,G+78]){x.beginPath();for(let px=0;px<=W;px+=16){const yy=by+Math.sin(px*.03+t*2+by)*2.5;px?x.lineTo(px,yy):x.moveTo(px,yy)}x.stroke()}
}
function boardwalk(){
 // gaps: draw planks except in gaps
 x.fillStyle='#4a2f1f';
 let gs=objs.filter(o=>o.t=='gap'&&o.x-dist<W+10&&o.x+o.w-dist>-10);
 let segs=[[0,W]];
 for(const o of gs){const a=o.x-dist,b=a+o.w;segs=segs.flatMap(([s,e])=>{if(b<=s||a>=e)return[[s,e]];const r=[];if(a>s)r.push([s,a]);if(b<e)r.push([b,e]);return r})}
 for(const [s,e] of segs){
  let g=x.createLinearGradient(0,G,0,G+40);g.addColorStop(0,'#8a5a36');g.addColorStop(1,'#3a2216');x.fillStyle=g;x.fillRect(s,G,e-s,28);
  x.fillStyle='#2a170e';x.fillRect(s,G+28,e-s,6);
  x.fillStyle='rgba(0,0,0,.35)';for(let px=Math.floor((s+dist)/48)*48-dist;px<e;px+=48)if(px>=s)x.fillRect(px,G,2,28);
  x.fillStyle='#d9a066';x.fillRect(s,G,e-s,3);
  x.fillStyle='#1c1008';for(let px=Math.floor((s+dist)/160)*160-dist;px<e;px+=160)if(px>=s+4&&px<e-8)x.fillRect(px,G+34,10,H-G);}
 // lamps + bunting
 for(let i=-1;i<8;i++){const lx=((i*300-dist*.9)%2400+2400)%2400-100;if(lx>W+40)continue;
  x.strokeStyle='rgba(30,20,20,.8)';x.lineWidth=1.5;x.beginPath();for(let u=0;u<=1.001;u+=.1){const bx=lx+2+300*u,by=G-122+Math.sin(u*Math.PI)*22;u?x.lineTo(bx,by):x.moveTo(bx,by)}x.stroke();
  x.globalAlpha=.85;for(let k=1;k<10;k++){const u=k/10,bx=lx+2+300*u,by=G-122+Math.sin(u*Math.PI)*22,sw=Math.sin(t*2+k+i)*1.5;x.fillStyle=hs((k+i*3)*47,75,58);x.beginPath();x.moveTo(bx-6,by);x.lineTo(bx+6,by);x.lineTo(bx+sw,by+14);x.fill()}x.globalAlpha=1;
  x.fillStyle='#222';x.fillRect(lx,G-130,5,130);x.fillRect(lx-8,G-134,21,6);
  const fk=.5+.08*Math.sin(t*9+i*3)+(Math.sin(t*23+i)>.97?-.2:0);
  let l=x.createRadialGradient(lx+2,G-122,2,lx+2,G-110,110);l.addColorStop(0,'rgba(255,220,140,'+fk+')');l.addColorStop(1,'rgba(255,220,140,0)');
  x.save();x.globalCompositeOperation='lighter';x.fillStyle=l;x.fillRect(lx-120,G-230,244,230);x.restore();
  x.fillStyle='#ffe9a8';x.beginPath();x.arc(lx+2,G-122,5,0,7);x.fill()}
}
function drawObjs(){
 for(const o of objs){const sx=o.x-dist;if(sx<-120||sx>W+60)continue;
  if(!o.dead&&(o.t=='crate'||o.t=='cop'||o.t=='barrel'||o.t=='gull'||o.t=='en')){const E=o.t=='en'?EN[o.k]:null,sw=E?E.w/2:o.t=='crate'?o.w/2+4:18,scx=sx+(E?E.w/2:o.t=='crate'?o.w/2:o.t=='gull'?18:15),al=E?Math.max(.06,.3-(G-(o.y+E.h))/220):o.t=='gull'?.18:.3;x.fillStyle='rgba(0,0,0,'+al+')';x.beginPath();x.ellipse(scx,G+3,sw,4,0,0,7);x.fill()}
  if(o.dead){x.save();x.translate(sx+o.pvx,o.pvy+o.fy);x.rotate(o.rot);x.translate(-(sx+o.pvx),-o.pvy)}
  if(o.t=='en')EN[o.k].dr(sx,o.y,o);
  if(o.t=='crate'){const y=G-o.h;x.fillStyle='#7a4a24';x.fillRect(sx,y,o.w,o.h);x.strokeStyle='#3d2310';x.lineWidth=3;x.strokeRect(sx+1.5,y+1.5,o.w-3,o.h-3);
   x.beginPath();x.moveTo(sx,y);x.lineTo(sx+o.w,y+o.h);x.moveTo(sx+o.w,y);x.lineTo(sx,y+o.h);x.stroke();x.fillStyle='rgba(255,255,255,.12)';x.fillRect(sx,y,o.w,4);const cr=[[0,0],[o.w-9,0],[0,o.h-9],[o.w-9,o.h-9]];x.fillStyle='#38302c';for(const q of cr)x.fillRect(sx+q[0],y+q[1],9,9);x.fillStyle='#b9b2a8';for(const q of cr)x.fillRect(sx+q[0]+3,y+q[1]+3,2,2)}
  else if(o.t=='coin'&&!o.got){const w=Math.abs(Math.cos(t*4+o.x*.01))*8+1;x.fillStyle='rgba(255,210,60,.14)';x.beginPath();x.arc(sx+8,o.y,15,0,7);x.fill();x.fillStyle='#ffd23f';x.beginPath();x.ellipse(sx+8,o.y,w,9,0,0,7);x.fill();
   x.fillStyle='rgba(255,255,255,.7)';x.fillRect(sx+7,o.y-5,2,4);if(Math.sin(t*3+o.x)>.92){x.fillStyle='#fff';x.fillRect(sx+2,o.y-1,12,2);x.fillRect(sx+7,o.y-6,2,12)}}
  else if(o.t=='gem'&&!o.got){const y=o.y+Math.sin(t*3)*5;let l=x.createRadialGradient(sx,y,2,sx,y,30);l.addColorStop(0,'rgba(255,120,255,.6)');l.addColorStop(1,'rgba(255,120,255,0)');
   x.fillStyle=l;x.fillRect(sx-30,y-30,60,60);x.fillStyle='#f6f';x.beginPath();x.moveTo(sx,y-14);x.lineTo(sx+12,y);x.lineTo(sx,y+14);x.lineTo(sx-12,y);x.fill();x.fillStyle='#fff8';x.beginPath();x.moveTo(sx,y-14);x.lineTo(sx+12,y);x.lineTo(sx,y);x.fill()}
  else if(o.t=='cop'){const b=Math.sin(o.ph)*6;x.fillStyle='rgba(255,250,200,.18)';x.beginPath();x.moveTo(sx,G-34);x.lineTo(sx-170,G-72);x.lineTo(sx-170,G+8);x.fill();
   x.fillStyle='#1d2f6f';x.fillRect(sx+4,G-36,22,26);x.fillRect(sx+6+b,G-12,7,12);x.fillRect(sx+17-b,G-12,7,12);
   x.fillStyle='#e8b98a';x.beginPath();x.arc(sx+15,G-44,9,0,7);x.fill();x.fillStyle='#10204f';x.fillRect(sx+4,G-56,22,6);x.fillRect(sx+2,G-51,26,3);x.fillStyle='#fd4';x.fillRect(sx+9,G-28,4,4)}
  else if(o.t=='barrel'){x.save();x.translate(sx+17,G-17);x.rotate(-o.ph);x.fillStyle='#8a5a2a';x.beginPath();x.arc(0,0,17,0,7);x.fill();x.strokeStyle='#3a2210';x.lineWidth=3;x.stroke();x.beginPath();x.moveTo(-17,0);x.lineTo(17,0);x.moveTo(0,-17);x.lineTo(0,17);x.stroke();x.restore()}
  else if(o.t=='hang'){const b=G-42;x.strokeStyle=o.st=='ice'?'#bfe8ff':'#666';x.lineWidth=3;x.beginPath();x.moveTo(sx+17,0);x.lineTo(sx+17,b-34);x.stroke();
   if(o.st=='ice'){x.fillStyle='#cdeeff';x.beginPath();x.moveTo(sx,b-40);x.lineTo(sx+34,b-40);x.lineTo(sx+17,b+2);x.fill()}
   else if(o.st=='lantern'){let l=x.createRadialGradient(sx+17,b-17,2,sx+17,b-17,50);l.addColorStop(0,'rgba(255,90,60,.5)');l.addColorStop(1,'rgba(255,90,60,0)');x.fillStyle=l;x.fillRect(sx-35,b-70,100,100);x.fillStyle='#e23';x.beginPath();x.roundRect(sx+3,b-34,28,34,8);x.fill();x.fillStyle='#fd4';x.fillRect(sx+10,b-40,14,6)}
   else{x.fillStyle='#d9a21b';x.fillRect(sx+2,b-34,30,24);x.fillStyle='#222';x.fillRect(sx+2,b-26,30,5);x.fillStyle='#777';x.beginPath();x.moveTo(sx+10,b-10);x.lineTo(sx+24,b-10);x.lineTo(sx+17,b+2);x.fill()}}
  else if(o.t=='spout'){const sp=(t+o.off)%2.4,on=sp>1.7,wn=sp>1.1&&!on;const c=o.st=='fire'?['255,140,30','255,230,120']:o.st=='steam'?['220,230,240','255,255,255']:['90,170,255','200,235,255'];
   x.fillStyle='#2a2a33';x.fillRect(sx,G-6,36,6);
   if(wn||on){const h=on?110:18+(sp-1.1)*20;let g=x.createLinearGradient(0,G-h,0,G);g.addColorStop(0,'rgba('+c[0]+',0)');g.addColorStop(1,'rgba('+c[on?1:0]+','+(on?.95:.6)+')');x.fillStyle=g;x.beginPath();x.moveTo(sx+4,G-6);x.quadraticCurveTo(sx+18,G-h*1.3,sx+32,G-6);x.fill()}}
  else if(o.t=='gull'){const y=o.y+Math.sin(o.ph*.4)*6,f=Math.sin(o.ph)*10;x.fillStyle='#eee';x.beginPath();x.ellipse(sx+18,y+12,18,8,0,0,7);x.fill();
   x.beginPath();x.arc(sx+4,y+8,6,0,7);x.fill();x.fillStyle='#f90';x.beginPath();x.moveTo(sx-2,y+8);x.lineTo(sx-10,y+11);x.lineTo(sx-2,y+12);x.fill();
   x.strokeStyle='#ccd';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(sx+14,y+8);x.lineTo(sx+22,y-6+f);x.lineTo(sx+34,y-8+f);x.stroke();
   x.fillStyle='#000';x.fillRect(sx+3,y+6,2,2)}
  if(o.dead)x.restore()}
}
function critter(k,run,sl,air){
 const kind=CH[k]?.kind||'raccoon',H2=sl?28:56,bob=air?0:Math.abs(Math.sin(run))*3,step=air?5:Math.sin(run)*8;
 x.translate(0,-bob);
 const palette={raccoon:['#85858f','#c8c7cb','#25252e'],possum:['#c9c3ba','#f0e9df','#e9a1ab'],cat:['#c98b52','#f1d2af','#d77736'],dog:['#bc895f','#f0d1aa','#875d3d'],crow:['#292b36','#555965','#d89a38'],armadillo:['#9c846c','#d3c3ad','#67533e'],mouse:['#aaa6a6','#ece5e2','#e6a0aa'],bear:['#79533d','#d4aa7b','#4e3428'],coyote:['#b89268','#ead7bb','#aa7752']}[kind];
 const [fur,belly,accent]=palette;x.lineCap='round';
 if(kind==='raccoon'){x.fillStyle=fur;x.beginPath();x.ellipse(-22,-24,18,8,-.25,0,7);x.fill();x.strokeStyle='#25252e';x.lineWidth=4;for(let q=0;q<3;q++){x.beginPath();x.moveTo(-32+q*8,-30);x.lineTo(-29+q*8,-18);x.stroke()}}
 else if(kind==='possum'||kind==='mouse'){x.strokeStyle=kind==='mouse'?'#e6a0aa':'#d2a3a7';x.lineWidth=4;x.beginPath();x.moveTo(-10,-22);x.bezierCurveTo(-30,-15,-39,-42,-52,-30);x.stroke()}
 else if(kind==='cat'){x.strokeStyle=fur;x.lineWidth=7;x.beginPath();x.moveTo(-10,-22);x.bezierCurveTo(-30,-10,-35,-44,-51,-31);x.stroke()}
 else if(kind==='dog'||kind==='coyote'){x.fillStyle=fur;x.beginPath();x.ellipse(-20,-30,13,6,-.5,0,7);x.fill()}
 else if(kind==='bear'){x.fillStyle=fur;x.beginPath();x.ellipse(-21,-25,15,9,-.3,0,7);x.fill()}
 else if(kind==='crow'){x.fillStyle=fur;x.beginPath();x.moveTo(-10,-27);x.lineTo(-34,-32);x.lineTo(-26,-21);x.closePath();x.fill()}
 x.fillStyle=accent;x.fillRect(-8+step,-10,9,10);x.fillRect(5-step,-10,9,10);
 x.fillStyle=fur;x.beginPath();x.roundRect(-15,-H2*.78,31,H2*.68,kind==='armadillo'?13:11);x.fill();
 x.fillStyle=belly;x.beginPath();x.roundRect(-7,-H2*.56,16,H2*.37,8);x.fill();
 if(kind==='armadillo'){x.fillStyle='#806a54';x.beginPath();x.roundRect(-12,-H2*.82,25,25,10);x.fill();x.strokeStyle='#c8b59d';x.lineWidth=2;for(let a=-7;a<=9;a+=8){x.beginPath();x.moveTo(a,-45);x.lineTo(a+2,-26);x.stroke()}}
 x.fillStyle='#bd9451';x.beginPath();x.arc(-14,-H2*.54,9,0,7);x.fill();x.fillStyle='#ffe38b';x.beginPath();x.ellipse(-14,-H2*.54+1,3,4,0,0,7);x.fill();x.strokeStyle='#bd9451';x.lineWidth=1;x.stroke();
 const hy=-H2*.94,scarf=kind==='crow'?'#e23':kind==='cat'?'#36c9b3':'#e64b40';x.fillStyle=scarf;x.beginPath();x.moveTo(-3,hy+11);x.quadraticCurveTo(-19,hy+15+Math.sin(t*14)*3,-37,hy+12+Math.sin(t*14)*4);x.lineTo(-29,hy+23);x.quadraticCurveTo(-15,hy+21,1,hy+21);x.fill();
 x.fillStyle=fur;
 if(kind==='cat'||kind==='coyote'||kind==='raccoon'){x.beginPath();x.moveTo(-3,hy-3);x.lineTo(-5,hy-22);x.lineTo(7,hy-12);x.closePath();x.fill();x.beginPath();x.moveTo(11,hy-11);x.lineTo(22,hy-23);x.lineTo(23,hy-2);x.closePath();x.fill()}
 else if(kind==='bear'||kind==='mouse'||kind==='possum'){x.beginPath();x.arc(1,hy-11,kind==='bear'?8:7,0,7);x.fill();x.beginPath();x.arc(19,hy-11,kind==='bear'?8:7,0,7);x.fill();x.fillStyle=kind==='bear'?'#b77f60':kind==='mouse'?'#edb0b8':'#e9a1ab';x.beginPath();x.arc(1,hy-11,4,0,7);x.fill();x.beginPath();x.arc(19,hy-11,4,0,7);x.fill()}
 else if(kind==='dog'){x.fillStyle=accent;x.beginPath();x.ellipse(-1,hy-9,6,12,-.5,0,7);x.fill();x.beginPath();x.ellipse(20,hy-9,6,12,.5,0,7);x.fill()}
 else if(kind==='armadillo'){x.beginPath();x.moveTo(-3,hy-2);x.lineTo(-2,hy-17);x.lineTo(8,hy-9);x.closePath();x.fill();x.beginPath();x.moveTo(14,hy-9);x.lineTo(23,hy-18);x.lineTo(23,hy-2);x.closePath();x.fill()}
 else {x.beginPath();x.arc(8,hy,14,0,7);x.fill()}
 if(kind==='crow'){x.beginPath();x.ellipse(8,hy,14,13,0,0,7);x.fill();x.fillStyle=accent;x.beginPath();x.moveTo(19,hy-1);x.lineTo(34,hy+4);x.lineTo(19,hy+7);x.closePath();x.fill()}
 else {x.beginPath();x.ellipse(9,hy,14,13,0,0,7);x.fill();x.fillStyle=belly;x.beginPath();x.ellipse(15,hy+6,8,5,0,0,7);x.fill();if(kind==='possum'||kind==='mouse'){x.beginPath();x.moveTo(14,hy-2);x.lineTo(36,hy+5);x.lineTo(14,hy+8);x.closePath();x.fill()}else if(kind==='dog'||kind==='bear'||kind==='coyote'){x.beginPath();x.ellipse(19,hy+5,9,6,0,0,7);x.fill()}}
 if(kind==='raccoon'){x.fillStyle='#292932';x.beginPath();x.ellipse(8,hy+1,14,5,0,0,7);x.fill()}
 if(kind==='armadillo'){x.strokeStyle='#d9c8b0';x.lineWidth=2;x.beginPath();x.arc(8,hy,13,-2.8,.8);x.stroke()}
 x.fillStyle='#fff';x.beginPath();x.ellipse(5,hy-1,3.1,4,0,0,7);x.fill();x.beginPath();x.ellipse(14,hy-1,3.1,4,0,0,7);x.fill();x.fillStyle='#17151a';x.beginPath();x.arc(6,hy,1.5,0,7);x.fill();x.beginPath();x.arc(15,hy,1.5,0,7);x.fill();
 x.fillStyle=kind==='crow'?'#e6a33e':kind==='possum'||kind==='mouse'?'#ea8297':'#28242a';x.beginPath();x.arc(kind==='possum'||kind==='mouse'?35:24,hy+5,2.7,0,7);x.fill();
 if((t%3.6)<.12){x.fillStyle='#fff';x.fillRect(4,hy-1,5,1);x.fillRect(13,hy-1,5,1)}
}
function bandit(){
 const px=170,py=P.y,sl=P.h<40,run=P.run,air=P.y+P.h<G-4;
 x.save();x.translate(px+20,py+P.h);if(!P.alive)x.rotate(t*8);
 x.fillStyle='rgba(0,0,0,.3)';if(!air)x.beginPath(),x.ellipse(0,0,24,5,0,0,7),x.fill();
 x.scale(1+sq*.3,1-sq*.3);
 if(sl){x.rotate(-.15)}else if(air){x.rotate(Math.max(-.25,Math.min(.35,P.vy/2500)))}else x.rotate(.04);
 if(P.spin>0){const f=1-P.spin/.45;x.save();x.translate(0,-28);x.rotate(-f*14);let gl=x.createRadialGradient(0,0,20,0,0,66);gl.addColorStop(0,'rgba(255,255,255,0)');gl.addColorStop(1,'rgba(255,240,170,.35)');x.fillStyle=gl;x.beginPath();x.arc(0,0,66,0,7);x.fill();x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=5;x.lineCap='round';for(let i=0;i<3;i++){x.beginPath();x.arc(0,0,58,i*2.094,i*2.094+1.1);x.stroke()}x.restore();x.translate(0,-28);x.rotate(f*Math.PI*4);x.translate(0,28)}critter(who,run,sl,air);
 x.restore();
}
function weather(){const w=M[3];
 if(w==9){x.fillStyle='rgba(215,165,90,.09)';x.fillRect(0,0,W,H)}
 if(w==8){x.fillStyle='rgba(20,110,170,.13)';x.fillRect(0,0,W,H);x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba(120,200,255,.05)';for(let i=0;i<4;i++){const s2=120+i*240+Math.sin(t*.4+i)*30;x.beginPath();x.moveTo(s2,0);x.lineTo(s2+60,0);x.lineTo(s2+10,G);x.lineTo(s2-90,G);x.fill()}x.restore()}
 if(w==3){let g=x.createLinearGradient(0,G-170,0,G+20);g.addColorStop(0,'rgba(200,210,230,0)');g.addColorStop(1,'rgba(200,210,230,.38)');x.fillStyle=g;x.fillRect(0,G-170,W,200)}
 if(w==6&&Math.sin(t*.9)>.97){x.fillStyle='rgba(255,255,255,.35)';x.fillRect(0,0,W,H)}
 for(const p of wx){
  if(w==1||w==6){p.y+=14+p.s*8;p.x-=4;x.strokeStyle='rgba(170,200,255,.5)';x.lineWidth=1.5;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-6,p.y+16);x.stroke();if(p.s>.6&&p.y>G-4&&p.y<G+22){x.fillStyle='rgba(200,225,255,.6)';x.fillRect(p.x-4,G+2,8,2)}}
  else if(w==2){p.y+=1.2+p.s*1.5;p.x-=.5;x.fillStyle='rgba(255,255,255,.85)';x.fillRect(p.x+Math.sin(t+p.s*9)*8,p.y,2.5,2.5)}
  else if(w==4){p.y+=1+p.s*2;x.fillStyle='rgba(255,'+(100+p.s*100|0)+',40,.8)';x.fillRect(p.x,H-p.y,2,2)}
  else if(w==5){x.fillStyle='rgba(220,255,120,'+(.3+.7*Math.abs(Math.sin(t*2+p.s*9)))+')';x.fillRect(p.x+Math.sin(t+p.s*9)*14,G-p.y*.6+20*Math.sin(t*.7+p.s*5),3,3)}
  else if(w==7){p.y+=.8+p.s*1.2;p.x-=1+p.s*1.2;x.fillStyle=lvl==30?hs(20+p.s*25,80,50):hs(335+p.s*20,75,78);x.save();x.translate(p.x+Math.sin(t*2+p.s*9)*10,p.y);x.rotate(t+p.s*9);x.beginPath();x.ellipse(0,0,4,2,0,0,7);x.fill();x.restore()}
  else if(w==8){p.y-=.6+p.s*1.1;p.x+=Math.sin(t+p.s*9)*.4;x.strokeStyle='rgba(200,240,255,.45)';x.lineWidth=1;x.beginPath();x.arc(p.x,p.y,1.5+p.s*4,0,7);x.stroke()}
  else if(w==9){p.x-=9+p.s*12;x.strokeStyle='rgba(235,195,120,.35)';x.lineWidth=1.5;x.beginPath();x.moveTo(p.x,p.y*.8+G*.1);x.lineTo(p.x+14+p.s*16,p.y*.8+G*.1);x.stroke()}
  else if(w==10){p.x-=9+p.s*6;p.y+=4+p.s*3;if(p.s>.7){x.strokeStyle='rgba(255,240,200,.85)';x.lineWidth=2;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+30,p.y-14);x.stroke()}}
  if(w==8&&p.y<-10)p.y=H+10;
  if(p.y>H)p.y=-10;if(p.x<-10)p.x=W+10}}
function pill(a,b,w,h){x.fillStyle='rgba(8,6,24,.55)';x.beginPath();x.roundRect(a,b,w,h,12);x.fill();x.strokeStyle='rgba(255,255,255,.15)';x.lineWidth=1;x.stroke()}
function hud(){
 if(loot!=hl){hl=loot;bump=1}
 pill(14,12,330,74);pill(W-214,12,200,58);
 const cw=Math.abs(Math.cos(t*3))*9+2;x.fillStyle='#ffd23f';x.beginPath();x.ellipse(36,36,cw,11,0,0,7);x.fill();x.fillStyle='rgba(255,255,255,.7)';x.fillRect(35,31,2,5);
 x.fillStyle='#fff';x.textAlign='left';x.font='bold '+((22+bump*6)|0)+'px system-ui,sans-serif';x.fillText(loot,56,43);
 x.font='13px system-ui,sans-serif';x.fillStyle='#cde';x.fillText('MAP '+(lvl+1)+'/'+NM+' · '+M[0]+' · '+DF[diff].n,26,62);
 const fr=(dist%LEN)/LEN;x.fillStyle='rgba(255,255,255,.2)';x.beginPath();x.roundRect(26,70,300,6,3);x.fill();
 let pg=x.createLinearGradient(26,0,326,0);pg.addColorStop(0,'#ff8a3d');pg.addColorStop(1,'#ffd23f');x.fillStyle=pg;x.beginPath();x.roundRect(26,70,Math.max(6,300*fr),6,3);x.fill();
 x.fillStyle='#fff';x.beginPath();x.arc(26+300*fr,73,5,0,7);x.fill();
 for(let i=0;i<NM;i++){x.fillStyle=i<lvl?'#ffd23f':i==lvl?'#fff':'rgba(255,255,255,.25)';x.fillRect(360+i*4,18,3,i==lvl?9+Math.sin(t*6)*1.5:7)}
 x.textAlign='right';x.fillStyle='#fff';x.font='bold 22px system-ui,sans-serif';x.fillText(Math.floor(dist/10)+' m',W-28,40);
 x.font='14px system-ui,sans-serif';x.fillStyle='#ffd23fcc';x.fillText('BEST '+hi,W-28,60);pill(684,490,154,34);x.save();x.translate(702,507);x.rotate(-.18);x.fillStyle='#ffd23f';x.beginPath();x.ellipse(0,0,9,12,0,0,7);x.fill();x.strokeStyle='#9d6714';x.lineWidth=2;x.stroke();x.fillStyle='#b27b1d';x.font='bold 12px system-ui,sans-serif';x.textAlign='center';x.fillText('★',0,4);x.restore();x.textAlign='left';x.font='bold 15px system-ui,sans-serif';x.fillStyle='#ffe8a0';x.fillText('TRASH  '+trashCount,718,512);if(trashToast>0){x.globalAlpha=Math.min(1,trashToast*2);pill(661,450,177,30);x.textAlign='center';x.font='bold 12px system-ui,sans-serif';x.fillStyle='#ffe8a0';x.fillText('LEVEL COIN COLLECTED!',749,470);x.globalAlpha=1}if(S=='play')spinBtn();
}
function center(a,y,sz,col){x.fillStyle=col||'#fff';x.font='bold '+sz+'px system-ui,sans-serif';x.textAlign='center';x.fillText(a,W/2,y)}
function cityAlt(st){
 const off=(dist*.08)%2800,L=M[4],B=G,col=hs(M[1],45,9+L*16),col2=hs(M[1],40,15+L*18);
 for(const b of skyline){const bx=((b.x-off)%2800+2800)%2800-200;if(bx>W+120)continue;const px=bx+b.w/2;
  if(st==1){const w2=b.w*3.2,h2=b.h*1.25+40;x.fillStyle=col;x.beginPath();x.moveTo(px-w2/2,B);x.lineTo(px,B-h2);x.lineTo(px+w2/2,B);x.fill();
   x.fillStyle=hs(M[1],20,72+L*20);x.beginPath();x.moveTo(px,B-h2);x.lineTo(px-w2*.11,B-h2*.78);x.lineTo(px-w2*.04,B-h2*.84);x.lineTo(px+w2*.02,B-h2*.77);x.lineTo(px+w2*.11,B-h2*.78);x.fill()}
  else if(st==2){for(let d=0;d<2;d++){const tx=px+d*b.w*.9,th=b.h*.7+30-d*14;x.fillStyle=d?col2:col;x.fillRect(tx-3,B-16,6,16);for(let k=0;k<3;k++){const yy=B-12-th*(k/3.2)*.8,ww=b.w*(.9-k*.2)+8;x.beginPath();x.moveTo(tx-ww,yy);x.lineTo(tx,yy-th*.52);x.lineTo(tx+ww,yy);x.fill()}}}
  else if(st==3){const tiers=2+(b.h>110?1:0);x.fillStyle=col;x.fillRect(px-b.w*.36,B-tiers*34-4,b.w*.72,tiers*34+4);
   for(let k=0;k<tiers;k++){const yy=B-k*34-26,ww=b.w*.7-k*7+12;x.fillStyle=col2;x.beginPath();x.moveTo(px-ww-8,yy);x.quadraticCurveTo(px-ww*.4,yy-4,px,yy-20);x.quadraticCurveTo(px+ww*.4,yy-4,px+ww+8,yy);x.quadraticCurveTo(px,yy-6,px-ww-8,yy);x.fill();if(L<.6){x.fillStyle='#ffcf7a';x.fillRect(px-3,yy+6,6,9)}}
   x.fillStyle=col;x.fillRect(px-1,B-tiers*34-26,2,16)}
  else if(st==4){if(b.h>120){x.fillStyle=col2;x.beginPath();x.moveTo(px-b.w*1.2,B);x.lineTo(px,B-b.h*.95);x.lineTo(px+b.w*1.2,B);x.fill();x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.moveTo(px,B-b.h*.95);x.lineTo(px+b.w*1.2,B);x.lineTo(px,B);x.fill()}else{x.fillStyle=col;x.beginPath();x.ellipse(px,B,b.w*1.7,b.h*.45,0,Math.PI,0);x.fill()}}
  else if(st==5){const hh=b.h*.7+20;x.fillStyle=col;x.fillRect(bx,B-hh,b.w+10,hh);x.fillRect(bx+b.w*.55,B-hh-46,10,46);x.fillRect(bx+2,B-hh-10,b.w*.35,10);
   for(let k=0;k<3;k++){x.fillStyle='rgba(190,190,205,'+(.28-k*.07)+')';x.beginPath();x.arc(bx+b.w*.55+5+Math.sin(t*.8+k+bx*.01)*8+k*7,B-hh-56-k*20,8+k*4,0,7);x.fill()}
   if(L<.6)for(let k=0;k<3;k++){x.fillStyle=b.win[k]?'#ffa84a':'#3a2a2a';x.fillRect(bx+6+k*14,B-hh+10,8,8)}}
  else{x.fillStyle=col;x.fillRect(bx,B-b.h,b.w,b.h);for(let k=0;k<4;k++)x.fillRect(bx+k*(b.w/4),B-b.h-8,b.w/8+1,8);
   if(b.h>100){x.fillStyle=col2;x.beginPath();x.moveTo(bx-4,B-b.h-8);x.lineTo(px,B-b.h-46);x.lineTo(bx+b.w+4,B-b.h-8);x.fill();x.fillStyle='#d22';x.fillRect(px,B-b.h-62,12,6);x.fillRect(px,B-b.h-62,1.5,16)}
   if(L<.6){x.fillStyle='#ffcf7a';x.fillRect(px-2,B-b.h+18,4,10);x.fillRect(px-2,B-b.h+48,4,10)}}
 }
}
// ---------------------------------------------------------------- MAP GALLERY
const thumbs=[],WXN=['clear','rain','snow','fog','embers','fireflies','storm','petals','bubbles','sandstorm','meteors'],HZN={c:'cops',b:'barrels',h:'hangers',s:'jets'};
let clr=[];try{clr=JSON.parse(localStorage.getItem('erb_clr')||'[]')}catch(e){}
function mark(i){if(!clr[i]){clr[i]=1;try{localStorage.setItem('erb_clr',JSON.stringify(clr))}catch(e){}}}
function sc(){return loot*10+Math.floor((dist-base)/10)}
function genThumb(i){const oc=document.createElement('canvas');oc.width=W;oc.height=H;const ox=x,sv=[dist,t,lvl,M,objs];
 x=oc.getContext('2d');dist=1500+i*211;t=4+i*.37;lvl=i;M=LV[i];objs=[];
 sky();city();water();boardwalk();
 const L2=ENP[i],ks=L2.length>6?[L2[3],L2[10],L2[18]]:L2.slice(0,3);
 ks.forEach((k,j)=>{const E=EN[k],y=E.y0!==undefined?Math.max(E.y0,G-110):G-E.h,sx=470+j*130;E_(sx+E.w/2,G+3,E.w/2,4,'rgba(0,0,0,.3)');E.dr(sx,y,{ph:1.1+j,y})});
 weather();
 let vg=x.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,10,.55)');x.fillStyle=vg;x.fillRect(0,0,W,H);
 x=ox;[dist,t,lvl,M,objs]=sv;
 const tc=document.createElement('canvas');tc.width=320;tc.height=180;tc.getContext('2d').drawImage(oc,0,0,320,180);thumbs[i]=tc}
const GC=4,GP=12,GX=31,GY=72,GW=214,GH=120,GDX=228,GDY=134;
function cellRect(k){return[GX+(k%GC)*GDX,GY+Math.floor(k/GC)*GDY,GW,GH]}
function openGal(){gPrev=S;S='gallery';gSel=Math.max(0,Math.min(NM-1,cp))}
function closeGal(){S=gPrev}
function playMap(i){cp=i;reset();S='play';t=0}
function galKey(e){const k=e.code;let h=1;
 if(k=='ArrowLeft'||k=='KeyA')gSel=Math.max(0,gSel-1);
 else if(k=='ArrowRight'||k=='KeyD')gSel=Math.min(NM-1,gSel+1);
 else if(k=='ArrowUp'||k=='KeyW')gSel=Math.max(0,gSel-GC);
 else if(k=='ArrowDown'||k=='KeyS')gSel=Math.min(NM-1,gSel+GC);
 else if(k=='PageUp')gSel=Math.max(0,gSel-GP);
 else if(k=='PageDown')gSel=Math.min(NM-1,gSel+GP);
 else if(k=='Home')gSel=0;else if(k=='End')gSel=NM-1;
 else if(k=='Enter'||k=='Space')playMap(gSel);
 else if(k=='Escape'||k=='KeyG'||k=='Backspace')closeGal();
 else h=0;if(h)e.preventDefault()}
function galClick(e,r){const px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H,pg=Math.floor(gSel/GP);
 if(py>=486&&py<=520){if(px>=31&&px<=131)closeGal();else if(px>=725&&px<=769)gSel=Math.max(0,gSel-GP);else if(px>=777&&px<=821)gSel=Math.min(NM-1,gSel+GP);else if(px>=829&&px<=929)playMap(gSel);return}
 for(let k=0;k<GP;k++){const i=pg*GP+k;if(i>=NM)break;const [a,b,w,h]=cellRect(k);if(px>=a&&px<=a+w&&py>=b&&py<=b+h){if(i==gSel)playMap(i);else gSel=i;return}}}
function gbtn(a,b,w,h,txt,hot){x.fillStyle=hot?'#ffd23f':'rgba(255,255,255,.1)';x.beginPath();x.roundRect(a,b,w,h,9);x.fill();x.strokeStyle=hot?'#fff':'rgba(255,255,255,.3)';x.lineWidth=hot?2:1;x.stroke();x.fillStyle=hot?'#10102a':'#cde';x.font='bold 15px system-ui,sans-serif';x.textAlign='center';x.fillText(txt,a+w/2,b+h/2+5)}
function galBtn(){x.save();x.fillStyle='rgba(8,6,24,.6)';x.beginPath();x.roundRect(24,484,170,34,10);x.fill();x.strokeStyle='rgba(255,210,63,.6)';x.lineWidth=1.5;x.stroke();x.fillStyle='#ffd23f';for(let i=0;i<4;i++)x.fillRect(38+(i%2)*8,492+Math.floor(i/2)*8,6,6);x.font='bold 14px system-ui,sans-serif';x.textAlign='left';x.fillText('MAP GALLERY [G]',62,506);x.restore()}
function galHit(e,r){const px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H;return px>=24&&px<=194&&py>=484&&py<=518}
function drawGallery(){
 let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b0a1a');g.addColorStop(1,'#1b1033');x.fillStyle=g;x.fillRect(0,0,W,H);
 for(const s of stars){x.globalAlpha=.25+.25*Math.sin(t*2+s.p);x.fillStyle='#fff';x.fillRect(s.x,s.y*2.1,1.5,1.5)}x.globalAlpha=1;
 const pg=Math.floor(gSel/GP),pages=Math.ceil(NM/GP);let nclr=0;for(let i=0;i<NM;i++)if(clr[i])nclr++;
 x.save();x.textAlign='left';x.font='bold 30px system-ui,sans-serif';let tg=x.createLinearGradient(0,20,0,50);tg.addColorStop(0,'#fff3a0');tg.addColorStop(1,'#ff9a3d');x.fillStyle=tg;x.shadowColor='#ff6a3d';x.shadowBlur=14;x.fillText('MAP GALLERY',31,48);x.restore();
 x.textAlign='right';x.font='bold 16px system-ui,sans-serif';x.fillStyle='#ffd23f';x.fillText('CLEARED '+nclr+'/'+NM+'   ·   PAGE '+(pg+1)+'/'+pages,W-31,34);x.font='12px system-ui,sans-serif';x.fillStyle='#9ad';x.fillText('Arrows select  ·  ENTER / SPACE play from that map  ·  ESC back',W-31,54);
 let budget=3;
 for(let k=0;k<GP;k++){const i=pg*GP+k;if(i>=NM)break;if(!thumbs[i]&&budget>0){genThumb(i);budget--}
  const [a,b,w,h]=cellRect(k),sel=i==gSel;
  x.save();x.beginPath();x.roundRect(a,b,w,h,10);x.clip();
  if(thumbs[i])x.drawImage(thumbs[i],a,b,w,h);else{x.fillStyle='#161230';x.fillRect(a,b,w,h)}
  let lg=x.createLinearGradient(0,b+h-40,0,b+h);lg.addColorStop(0,'rgba(0,0,0,0)');lg.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=lg;x.fillRect(a,b+h-40,w,40);
  x.restore();
  x.textAlign='left';x.fillStyle='#fff';x.font='bold 13px system-ui,sans-serif';x.fillText(LV[i][0],a+9,b+h-9);
  x.fillStyle='rgba(8,6,24,.7)';x.beginPath();x.roundRect(a+6,b+6,34,20,6);x.fill();x.fillStyle='#ffd23f';x.font='bold 12px system-ui,sans-serif';x.textAlign='center';x.fillText('#'+(i+1),a+23,b+20);
  if(clr[i]){x.fillStyle='#ffd23f';star(a+w-18,b+18,10,0);x.fill();x.strokeStyle='#7a4a10';x.lineWidth=2;x.stroke()}
  if(sel){x.save();x.shadowColor='#ffd23f';x.shadowBlur=14+4*Math.sin(t*5);x.strokeStyle='#ffd23f';x.lineWidth=3;x.beginPath();x.roundRect(a,b,w,h,10);x.stroke();x.restore()}
  else{x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=1;x.beginPath();x.roundRect(a,b,w,h,10);x.stroke()}}
 for(let i=0;i<NM&&budget>0;i++)if(!thumbs[i]){genThumb(i);budget--}
 const m=LV[gSel],hz=[...new Set(HZ[gSel])].filter(k=>k!='e').map(k=>HZN[k]).join(', '),en=ENP[gSel].map(n=>EN[n].n),ens=en.length>5?en.slice(0,4).join(', ')+' +'+(en.length-4)+' more':en.join(', ');
 x.textAlign='center';x.fillStyle='#fff';x.font='bold 17px system-ui,sans-serif';x.fillText('MAP '+(gSel+1)+' · '+m[0]+(clr[gSel]?'  ★':''),432,498);
 x.font='12px system-ui,sans-serif';x.fillStyle='#9ad';x.fillText('Hazards: '+hz+'  ·  Weather: '+WXN[m[3]]+'  ·  '+(m[4]>.55?'Daytime':m[4]>.2?'Dusk':'Night'),432,515);x.fillText('Enemies: '+ens,432,531);
 gbtn(31,486,100,34,'◀ BACK',false);gbtn(725,486,44,34,'◀',false);gbtn(777,486,44,34,'▶',false);gbtn(829,486,100,34,'PLAY ▶',true)}
function celebrate(n){celeb=2;celN=n;
 for(let i=0;i<110;i++)conf.push({x:rnd(0,W),y:rnd(-200,-10),vx:rnd(-60,60),vy:rnd(120,300),r:rnd(0,6),vr:rnd(-8,8),w:rnd(6,11),h:rnd(4,8),c:hs(rnd(0,360),90,60),l:5});
 for(let i=0;i<5;i++)fw.push({x:rnd(120,W-120),y:H,ty:rnd(80,250),d:i*.28,vy:-520,c:rnd(0,360)})}
function star(cx,cy,r,rot){x.beginPath();for(let i=0;i<10;i++){const a=rot+i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.closePath()}
function celebFX(){
 if(!(conf.length||spk.length||fw.length||celeb>0))return;
 x.save();const p=2-celeb;
 if(celeb>0&&S=='play'){const a=Math.min(1,celeb);
  x.save();x.globalCompositeOperation='lighter';x.translate(W/2,205);x.rotate(t*.6);x.fillStyle='rgba(255,220,100,'+a*.13+')';for(let i=0;i<14;i++){x.rotate(Math.PI/7);x.beginPath();x.moveTo(0,0);x.lineTo(-34,-480);x.lineTo(34,-480);x.fill()}x.restore();
  let gv=x.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H);gv.addColorStop(0,'rgba(255,210,80,0)');gv.addColorStop(1,'rgba(255,210,80,'+a*.3+')');x.fillStyle=gv;x.fillRect(0,0,W,H)}
 x.globalCompositeOperation='lighter';
 for(const f of fw){if(f.d>0)continue;x.fillStyle='#fff';x.fillRect(f.x-2,f.y,4,10)}
 for(const s of spk){x.globalAlpha=Math.min(1,s.l*1.5);x.fillStyle=hs(s.c,100,62);x.fillRect(s.x-s.s/2,s.y-s.s/2,s.s,s.s)}
 x.globalAlpha=1;x.globalCompositeOperation='source-over';
 for(const c of conf){x.save();x.translate(c.x,c.y);x.rotate(c.r);x.fillStyle=c.c;x.fillRect(-c.w/2,-c.h/2,c.w,c.h*Math.abs(Math.cos(c.r*2))+1);x.restore()}
 if(celeb>0&&S=='play'){
  const al=Math.min(1,celeb*1.6),k=Math.min(1,p/.35),sc=k<1?(1-Math.pow(1-k,3))*1.15:1.15-.15*Math.min(1,(p-.35)*4);
  x.globalAlpha=al;
  for(let i=0;i<3;i++){const ss=Math.max(0,Math.min(1,(p-.12*i-.1)*4)),cx2=W/2+(i-1)*76,cy2=i==1?112:128,r=(i==1?30:22)*ss*(1+Math.sin(t*6+i)*.05);x.fillStyle='#ffd23f';x.strokeStyle='#7a4a10';x.lineWidth=4;star(cx2,cy2,r,t*(i-1)*.8+(1-ss)*3);x.fill();x.stroke()}
  x.save();x.translate(W/2,200);x.scale(sc,sc);x.font='bold 56px system-ui,sans-serif';x.textAlign='center';x.lineJoin='round';x.lineWidth=9;x.strokeStyle='#2a0f1f';let tg=x.createLinearGradient(0,-44,0,8);tg.addColorStop(0,'#fff3a0');tg.addColorStop(1,'#ff9a3d');x.shadowColor='#ff6a3d';x.shadowBlur=22;const tt='MAP '+celN+' CLEARED!';x.strokeText(tt,0,0);x.fillStyle=tg;x.fillText(tt,0,0);x.restore();
  x.font='bold 22px system-ui,sans-serif';x.textAlign='center';x.fillStyle='#fff';x.fillText('+10 LOOT BONUS',W/2,244);
  x.globalAlpha=1;
  for(let i=0;i<6;i++){const ang=t*5+i*Math.PI/3,sx3=190+Math.cos(ang)*36,sy3=P.y+P.h/2+Math.sin(ang)*34,sr=3+Math.abs(Math.sin(t*8+i))*3;x.fillStyle='#fff6b0';x.fillRect(sx3-sr,sy3-1,sr*2,2);x.fillRect(sx3-1,sy3-sr,2,sr*2)}}
 x.restore()}
function introRiver(){
 // Quiet wooded banks frame a broad winding river.
 let ground=x.createLinearGradient(0,230,0,H);ground.addColorStop(0,'#314c38');ground.addColorStop(1,'#162b26');x.fillStyle=ground;x.fillRect(0,220,W,H-220);
 // Distant evergreen ridge.
 for(let i=0;i<34;i++){const px=i*31-18,hh=68+Math.abs(Math.sin(i*7.31))*78,base=324+(i%3)*8,col=i%2?'#203b31':'#294535';x.fillStyle=col;x.fillRect(px+18,base-hh*.2,7,hh*.2);for(let tier=0;tier<3;tier++){const top=base-hh+tier*hh*.23,ww=hh*(.36-tier*.06);x.beginPath();x.moveTo(px,top+hh*.28);x.lineTo(px+21,top);x.lineTo(px+42,top+hh*.28);x.closePath();x.fill()}}
 // River widens toward the foreground, reflecting the sky.
 let water=x.createLinearGradient(0,305,0,405);water.addColorStop(0,'#36545b');water.addColorStop(.5,'#2d4c55');water.addColorStop(1,'#1a3944');x.fillStyle=water;x.beginPath();x.moveTo(0,324);x.bezierCurveTo(180,302,320,335,485,315);x.bezierCurveTo(650,298,800,333,960,312);x.lineTo(960,390);x.bezierCurveTo(780,409,630,378,475,398);x.bezierCurveTo(300,416,140,382,0,402);x.closePath();x.fill();
 // Soft moving reflections.
 x.save();x.strokeStyle='rgba(195,226,197,.24)';x.lineWidth=2;for(let i=0;i<6;i++){const yy=328+i*11,half=24+i*19,cx=480+Math.sin(t*1.2+i)*28;x.beginPath();x.moveTo(cx-half,yy);x.quadraticCurveTo(cx,yy+Math.sin(t*2+i)*2,cx+half,yy);x.stroke()}x.restore();
 // Foreground pines on both riverbanks.
 for(const [px,hh] of [[24,190],[108,142],[175,112],[780,125],[855,177],[930,205]]){const base=414;x.fillStyle='#152922';x.fillRect(px-4,base-hh*.46,8,hh*.46);for(let tier=0;tier<4;tier++){const top=base-hh+tier*hh*.2,ww=hh*(.34-tier*.035);x.beginPath();x.moveTo(px-ww,top+hh*.27);x.lineTo(px,top);x.lineTo(px+ww,top+hh*.27);x.closePath();x.fill()}}
 // Riverbank grass gives the gang a place to stand.
 x.fillStyle='#263e2b';x.beginPath();x.moveTo(0,397);x.quadraticCurveTo(160,384,320,403);x.lineTo(640,403);x.quadraticCurveTo(810,382,960,399);x.lineTo(960,425);x.lineTo(0,425);x.closePath();x.fill();
}
function drawIntro(){
 const q=introT;sky();introRiver();
 x.fillStyle='rgba(5,5,22,.38)';x.fillRect(0,0,W,H);
 x.fillStyle='rgba(7,7,25,.68)';x.fillRect(0,0,W,76);x.save();x.textAlign='center';x.font='900 34px system-ui,sans-serif';x.lineJoin='round';x.lineWidth=5;x.strokeStyle='#28111d';x.strokeText('ELK RIVER BANDIT',W/2,49);x.shadowColor='#ff783b';x.shadowBlur=15;x.fillStyle='#ffe28a';x.fillText('ELK RIVER BANDIT',W/2,49);x.restore();
 // Wordless opening: let the characters and the chase tell the story.
 // The tempting bin, with its lid wobbling every time the gang rummages.
 const rummage=q>3&&q<8.2,lid=Math.sin(q*11)* (rummage?10:2);
 x.save();x.fillStyle='rgba(0,0,0,.38)';x.beginPath();x.ellipse(480,422,95,10,0,0,7);x.fill();
 let metal=x.createLinearGradient(430,0,530,0);metal.addColorStop(0,'#36404c');metal.addColorStop(.22,'#87919a');metal.addColorStop(.5,'#59636b');metal.addColorStop(.8,'#a0a6a8');metal.addColorStop(1,'#343e48');x.fillStyle=metal;x.beginPath();x.roundRect(431,335,98,87,12);x.fill();x.strokeStyle='#c1c9c9';x.lineWidth=3;x.stroke();x.fillStyle='rgba(12,18,22,.55)';x.beginPath();x.ellipse(480,337,49,13,0,Math.PI,Math.PI*2);x.fill();x.fillStyle='#c4ccca';x.beginPath();x.ellipse(480,335,50,13,lid*.012,0,Math.PI*2);x.fill();x.strokeStyle='#3f4b52';x.lineWidth=3;x.stroke();
 for(let i=0;i<3;i++){x.fillStyle='rgba(18,27,32,.28)';x.fillRect(448+i*28,352,3,62)}
 // An embossed recycle mark makes it unmistakably a trash bin, without a label.
 x.strokeStyle='#78a98b';x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(471,387);x.lineTo(478,374);x.lineTo(485,374);x.moveTo(482,370);x.lineTo(487,374);x.lineTo(481,376);x.moveTo(488,379);x.lineTo(495,391);x.lineTo(491,397);x.moveTo(498,390);x.lineTo(494,397);x.lineTo(490,391);x.moveTo(485,400);x.lineTo(471,400);x.lineTo(467,393);x.moveTo(471,404);x.lineTo(466,398);x.lineTo(473,397);x.stroke();
 x.fillStyle='#202a30';x.fillRect(439,331,82,7);x.fillRect(448,421,10,5);x.fillRect(502,421,10,5);x.restore();
 // A clearly non-coin piece of rubbish bobs out of the bin as they rummage.
 if(rummage){x.save();x.translate(480+Math.sin(q*7)*44,325-Math.abs(Math.sin(q*5))*48);x.rotate(Math.sin(q*8)*.55);x.fillStyle='#3c899a';x.beginPath();x.roundRect(-8,-9,16,23,4);x.fill();x.fillRect(-4,-15,8,8);x.fillStyle='#b8d4cc';x.fillRect(-7,0,14,7);x.fillStyle='#d5bf84';x.fillRect(-4,-17,8,3);x.restore()}
 const homes=Array.from({length:9},(_,i)=>246+i*58.5);
 const gather=Math.max(0,Math.min(1,(q-.25)/2.6));
 for(let i=0;i<9;i++){
  let px=homes[i];if(q<2.85){const from=i<4?-90-i*47:1050+(i-4)*48;const e=gather*gather*(3-2*gather);px=from+(homes[i]-from)*e}
  let flee=Math.max(0,Math.min(1,(q-11.15)/2.65));if(flee>0){const dir=i<4?-1:1;px+=dir*flee*flee*560}
  const wobble=rummage?Math.sin(q*12+i*2.2)*3:0;
  if(q>8.05&&q<9.5)px+=Math.sin(q*38+i*5)*2;
  x.save();x.translate(px,420+wobble);const scale=.57;x.scale(i>=5?-scale:scale,scale);x.rotate(rummage?Math.sin(q*9+i)*.07:0);critter(i,q*8+i*.7,false,false);x.restore();
  if(rummage&&i%2===0&&Math.sin(q*8+i)>0.6){x.strokeStyle='#fff5c4';x.lineWidth=2;x.beginPath();x.moveTo(px-5,350+Math.sin(q*11+i)*8);x.lineTo(px,344+Math.sin(q*11+i)*8);x.lineTo(px+5,350+Math.sin(q*11+i)*8);x.stroke()}
 }
 // A very sleepy human, charging in slippers with a broom like it is a heroic weapon.
 const approach=Math.max(0,Math.min(1,(q-9.1)/1.25)),chase=Math.max(0,q-11.05),ownerX=q<9.1?1030:Math.max(548,1030-approach*240-chase*145);
 if(q>9.05){const run=Math.sin(q*16);x.save();x.translate(ownerX,420);x.scale(.9,.9);x.fillStyle='#25252d';x.beginPath();x.ellipse(0,2,30,6,0,0,7);x.fill();
  x.fillStyle='#38536a';x.fillRect(-18,-59,38,51);x.fillStyle='#d6a77e';x.beginPath();x.arc(1,-76,19,0,7);x.fill();x.fillStyle='#564237';x.beginPath();x.ellipse(1,-87,20,11,0,Math.PI,Math.PI*2);x.fill();x.fillRect(-19,-85,8,16);x.fillStyle='#2a2526';x.fillRect(7,-78,4,3);x.fillRect(-5,-78,4,3);x.fillStyle='#8d2630';x.beginPath();x.ellipse(1,-68,7,4,0,0,7);x.fill();
  x.fillStyle='#38536a';x.beginPath();x.moveTo(-18,-56);x.lineTo(18,-56);x.lineTo(25,-8);x.lineTo(-24,-8);x.closePath();x.fill();x.strokeStyle='#24394b';x.lineWidth=3;x.stroke();x.fillStyle='#d6a77e';x.lineWidth=8;x.lineCap='round';x.beginPath();x.moveTo(-15,-49);x.lineTo(-34+run*4,-72);x.moveTo(16,-49);x.lineTo(34-run*4,-72);x.stroke();
  x.fillStyle='#26313a';x.fillRect(-17,-8,13,7+run*4);x.fillRect(6,-8,13,7-run*4);x.fillStyle='#f5d176';x.beginPath();x.ellipse(-12,0,12,5,0,0,7);x.fill();x.beginPath();x.ellipse(12,0,12,5,0,0,7);x.fill();
  // Broom held high: dramatic, if you are a raccoon.
  x.strokeStyle='#744d35';x.lineWidth=5;x.beginPath();x.moveTo(-35,-70);x.lineTo(-60,-125);x.stroke();x.fillStyle='#d7b679';x.beginPath();x.moveTo(-67,-128);x.lineTo(-49,-136);x.lineTo(-43,-123);x.lineTo(-59,-117);x.fill();x.restore();
 }
 if(q>8.15&&q<11.5){for(let i=0;i<3;i++){x.strokeStyle='rgba(255,240,150,'+(0.65-i*.17)+')';x.lineWidth=2;x.beginPath();x.arc(480,320,60+i*17+Math.sin(q*30)*5,.8,2.3);x.stroke()}x.strokeStyle='#fff1a0';x.lineWidth=4;for(let i=0;i<8;i++){const a=i*Math.PI/4,rx=q<9.2?480:ownerX,ry=250;x.beginPath();x.moveTo(rx+Math.cos(a)*25,ry+Math.sin(a)*25);x.lineTo(rx+Math.cos(a)*37,ry+Math.sin(a)*37);x.stroke()}}
 // The human's flailing broom and the fleeing crew carry the whole punchline.
 x.fillStyle='rgba(255,255,255,.2)';x.fillRect(40,522,880,4);x.fillStyle='#ffd23f';x.fillRect(40,522,880*Math.min(1,q/15),4);
 if(q>14.1){x.globalAlpha=Math.min(1,(q-14.1)/.8);x.fillStyle='rgba(5,5,22,.58)';x.fillRect(0,0,W,H);x.globalAlpha=1}
}
function draw(){if(S=='gallery'){drawGallery();return}M=LV[Math.min(lvl,NM-1)];if(S=='intro'){drawIntro();return}
 x.save();if(shake>0)x.translate(rnd(-6,6)*shake*3,rnd(-6,6)*shake*3);
 sky();city();water();boardwalk();drawObjs();
 for(const q of trail){const gx=190-(dist-q.d);x.fillStyle='rgba(150,200,255,'+(q.l*.9)+')';x.beginPath();x.roundRect(gx-14,q.y+q.h*.1,28,q.h*.8,10);x.fill()}
 bandit();
 for(const p of parts){x.globalAlpha=Math.max(0,p.l*2);x.fillStyle=p.col;x.fillRect(p.x,p.y,p.s,p.s)}x.globalAlpha=1;
 for(const r of rings){x.globalAlpha=Math.max(0,r.l*2);x.strokeStyle='#bfe8ff';x.lineWidth=2;x.beginPath();x.ellipse(r.x,r.y,r.r,r.r*.3,0,0,7);x.stroke()}x.globalAlpha=1;
 for(const p of pops){x.globalAlpha=Math.min(1,p.l*2);x.font='bold 18px system-ui,sans-serif';x.textAlign='center';x.lineWidth=4;x.strokeStyle='rgba(0,0,0,.6)';x.strokeText(p.t,p.x-dist,p.y);x.fillStyle=p.col;x.fillText(p.t,p.x-dist,p.y)}x.globalAlpha=1;
 if(S=='play'&&v>380){const a=Math.min(.16,(v-380)/900);x.strokeStyle='rgba(255,255,255,'+a+')';x.lineWidth=1.5;for(let i=0;i<10;i++){const lx=W-((i*173+t*(900+i*80))%(W+300)),ly=50+(i*53)%(G-120);x.beginPath();x.moveTo(lx,ly);x.lineTo(lx+40+v*.1,ly);x.stroke()}}
 x.restore();
 weather();// vignette
 let vg=x.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,10,.55)');x.fillStyle=vg;x.fillRect(0,0,W,H);
 if(dflash>0){let rv=x.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H);rv.addColorStop(0,'rgba(255,0,40,0)');rv.addColorStop(1,'rgba(255,0,40,'+dflash*.55+')');x.fillStyle=rv;x.fillRect(0,0,W,H)}
 if(S!='title')hud();
 if(S=='play'&&banner>0&&banner<=3){const k=Math.min(1,(3-banner)*3),a=Math.min(1,banner,k),sl=(1-k)*-120;x.globalAlpha=a;x.save();x.translate(sl,0);
  let bg=x.createLinearGradient(0,0,W,0);bg.addColorStop(0,'rgba(0,0,0,0)');bg.addColorStop(.25,'rgba(0,0,0,.45)');bg.addColorStop(.75,'rgba(0,0,0,.45)');bg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=bg;x.fillRect(0,118,W,136);
  x.fillStyle='#ffd23f';x.fillRect(W/2-170,126,340,2);x.fillRect(W/2-170,246,340,2);
  center('MAP '+(lvl+1)+' OF '+NM,150,24,'#ffd23f');center(M[0].toUpperCase(),198,46);center([...new Set(HZ[Math.min(lvl,NM-1)])].map(k=>k=='e'?ENP[Math.min(lvl,NM-1)].map(n=>EN[n].n).join('/'):({c:'cops',b:'rolling barrels',h:'hangers: slide',s:'pulsing jets'})[k]).join(' · '),232,18,'#9ad');x.restore();x.globalAlpha=1}
 if(flash>0){x.fillStyle='rgba(255,255,255,'+flash*.5+')';x.fillRect(0,0,W,H)}
 if(S=='win'){x.fillStyle='rgba(10,5,30,.65)';x.fillRect(0,0,W,H);for(let i=0;i<40;i++){x.fillStyle=hs(i*37,90,60);x.fillRect((i*97+t*60)%W,(i*53+t*140*(1+i%3*.3))%H,6,10)}center('YOU PULLED OFF THE HEIST!',220,52,'#ffd23f');center('All '+NM+' maps cleared  ·  Loot '+loot,276,24);if(Math.sin(t*4)>0)center('PRESS SPACE OR TAP TO PLAY AGAIN',340,20)}
 if(S=='title'){x.fillStyle='rgba(5,5,25,.55)';x.fillRect(0,0,W,H);
  x.save();x.globalCompositeOperation='lighter';for(const s of[-1,1]){x.save();x.translate(W/2+s*430,H);x.rotate(s*(-.5+Math.sin(t*.8+s)*.25));let bg=x.createLinearGradient(0,0,0,-520);bg.addColorStop(0,'rgba(255,240,180,.16)');bg.addColorStop(1,'rgba(255,240,180,0)');x.fillStyle=bg;x.beginPath();x.moveTo(-14,0);x.lineTo(14,0);x.lineTo(70,-520);x.lineTo(-70,-520);x.fill();x.restore()}x.restore();
  x.save();x.font='bold 68px system-ui,sans-serif';x.textAlign='left';const T='ELK RIVER BANDIT';let tw=0;const ws=[...T].map(ch=>{const w=x.measureText(ch).width;tw+=w;return w});let tx=W/2-tw/2;
  const tg=x.createLinearGradient(0,160,0,225);tg.addColorStop(0,'#fff3a0');tg.addColorStop(.5,'#ffd23f');tg.addColorStop(1,'#ff8a3d');
  x.shadowColor='#ff6a3d';x.shadowBlur=24;x.lineJoin='round';x.lineWidth=8;x.strokeStyle='#2a0f1f';
  [...T].forEach((ch,i)=>{const ty=210+Math.sin(t*3+i*.5)*5;x.strokeText(ch,tx,ty);x.fillStyle=tg;x.fillText(ch,tx,ty);tx+=ws[i]});x.restore();
  for(let i=0;i<16;i++){const sx2=W/2+Math.cos(i*2.4)*(260+(i%4)*20),sy2=190+Math.sin(i*1.7)*(40+(i%3)*10),sa=Math.max(0,Math.sin(t*3+i*1.3));x.globalAlpha=sa;x.fillStyle='#fff';x.fillRect(sx2-6*sa,sy2-1,12*sa,2);x.fillRect(sx2-1,sy2-6*sa,2,12*sa)}x.globalAlpha=1;
  center(NM+' MAPS · ONE LONG HEIST ALONG THE RIVER',246,20,'#9ad');
  for(let i=0;i<CH.length;i++){const col=i%3,row=Math.floor(i/3),cx0=W/2-222+col*148,cy0=254+row*39,sel=i==who;
   x.fillStyle=sel?'rgba(255,210,63,.22)':'rgba(255,255,255,.07)';x.beginPath();x.roundRect(cx0,cy0,140,34,8);x.fill();x.strokeStyle=sel?'#ffd23f':'rgba(255,255,255,.25)';x.lineWidth=sel?2:1;x.stroke();
   x.save();x.translate(cx0+18,cy0+32);x.scale(.38,.38);critter(i,sel?t*8:0,false,false);x.restore();
   x.textAlign='left';x.fillStyle=sel?'#fff':'#cde';x.font='bold 13px system-ui,sans-serif';x.fillText(CH[i].n.toUpperCase(),cx0+36,cy0+15);x.font='10px system-ui,sans-serif';x.fillStyle=sel?'#ffd23f':'#9ad';x.fillText(CH[i].d,cx0+36,cy0+28)}
  for(let i=0;i<3;i++){const bx=W/2+(i-1)*170-70,sel=i==diff,d=DF[i];x.fillStyle=sel?d.col:'rgba(255,255,255,.1)';x.beginPath();x.roundRect(bx,374,140,32,9);x.fill();x.strokeStyle=sel?'#fff':'rgba(255,255,255,.3)';x.lineWidth=sel?3:1;x.stroke();x.fillStyle=sel?'#10102a':'#cde';x.font='bold 16px system-ui,sans-serif';x.textAlign='center';x.fillText(d.n,bx+70,395)}

  if(Math.sin(t*4)>0)center('PRESS SPACE OR TAP TO START',445,21);
  center('SPACE / ↑ jump (twice for double jump)  ·  ↓ slide  ·  X / SHIFT spin attack',472,14,'#ccd');
  center('Touch: tap left to jump, right to slide, SPIN button to spin  ·  C: cycle character',491,14,'#ccd');
  x.save();x.textAlign='right';x.font='bold 18px system-ui,sans-serif';x.shadowColor='#ffd23f';x.shadowBlur=10;x.fillStyle='#ffe9a8';x.fillText('JORJ26',W-24,H-22);x.restore()}
 if(S=='over'){x.fillStyle='rgba(20,0,10,.6)';x.fillRect(0,0,W,H);
  {const fl=Math.sin(t*10)>0,bx=fl?0:W;let sg=x.createRadialGradient(bx,0,10,bx,0,460);sg.addColorStop(0,fl?'rgba(255,40,40,.4)':'rgba(40,90,255,.4)');sg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sg;x.fillRect(0,0,W,H)}
  x.save();x.shadowColor='#f00';x.shadowBlur=30;center('BUSTED!',230+Math.sin(t*30)*Math.max(0,.4-t)*20,64,'#ff5a5a');x.restore();center('Difficulty: '+DF[diff].n+'   (◀ ▶ to change)  ·  '+CH[who].n+' (C to switch)  ·  G: gallery',384,16,'#9ad');
  center('Loot '+loot+'  ·  '+Math.floor(dist/10)+' m  ·  Score '+sc(),284,24);
  if(t>.6&&Math.sin(t*4)>0)center('RETRY FROM MAP '+(cp+1)+' · SPACE OR TAP',340,20)}
 if(S=='title'||S=='over'||S=='win')galBtn();
 celebFX();
}
reset();P.alive=true;let last=performance.now();
function loop(n){const dt=Math.min(.033,(n-last)/1000);last=n;
 if(S=='title'){dist+=120*dt;t+=dt;P.run+=dt*5;parts=[]}else update(dt);
 if(S=='title'){objs=[]}draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
