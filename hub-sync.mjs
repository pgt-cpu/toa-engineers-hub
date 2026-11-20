#!/usr/bin/env node
// TOA Engineers Hub: automatic resource sync. Usage: node hub-sync.mjs "path/to/your/folder"
// Add --dry-run to preview, --no-push to skip GitHub. Needs Node 18+ and Git.
// Clean up what is already on the site:  review  |  apply <file.csv>  |  fix [--auto-spell]   (see hub-rules.json)
import fs from "node:fs";import path from "node:path";import {execFileSync} from "node:child_process";
const PR=["Aerospace","Agricultural","Automobile","Biomedical","Chemical","Civil","Computer","Electrical & Electronic","Geological","Geomatic","Industrial","Marine","Materials","Mechanical","Metallurgical","Petrochemical","Petroleum","Telecommunication"];
const TY=["Timetables","Past questions","Study materials"];
const PK=[["Petrochemical",/petro-?chem/],["Petroleum",/petroleum/],["Telecommunication",/telecom/],["Electrical & Electronic",/electrical|electronic|\beee\b|\bee\b/],["Aerospace",/aero/],["Agricultural",/agric/],["Automobile",/automo/],["Biomedical",/biomed/],["Chemical",/chem/],["Civil",/civil/],["Computer",/computer|\bcpe\b/],["Geological",/geolog/],["Geomatic",/geomat/],["Industrial",/industrial/],["Marine",/marine/],["Materials",/^materials?( (eng|sci).*)?$/],["Mechanical",/mechanical|\bmech\b/],["Metallurgical",/metallurg/]];
const SKIP=/^(\.ds_store|thumbs\.db|desktop\.ini)$|^~\$|^\./i,VID=/\.(mp4|mkv|mov|avi|webm|m4v|wmv|flv|3gp|mpeg|mpg)$/i;
const CC=/\b[A-Za-z]{2,5}\s?-?\s?(\d{3})[A-Za-z]?\b/;
let ALIAS={};
const STEMS=[["aerospace","Aerospace"],["agricultural","Agricultural"],["automobile","Automobile"],["biomedical","Biomedical"],["chemical","Chemical"],["computer","Computer"],["electrical","Electrical & Electronic"],["electronic","Electrical & Electronic"],["geological","Geological"],["geomatic","Geomatic"],["industrial","Industrial"],["materials","Materials"],["mechanical","Mechanical"],["metallurgical","Metallurgical"],["petrochemical","Petrochemical"],["petroleum","Petroleum"],["telecommunication","Telecommunication"],["telecom","Telecommunication"]];
function lev(a,b){const p=[];for(let j=0;j<=b.length;j++)p[j]=j;for(let i=1;i<=a.length;i++){let d=p[0];p[0]=i;for(let j=1;j<=b.length;j++){const t=p[j];p[j]=Math.min(p[j]+1,p[j-1]+1,d+(a[i-1]===b[j-1]?0:1));d=t}}return p[b.length]}
const MB=1048576,UNSAFE=/[#?%&+'"<>:*|\\]/;
const mb=n=>n>=MB?(n/MB).toFixed(1)+" MB":Math.max(1,Math.round(n/1024))+" KB";
const takeout=s=>s.replace(/-\d{8}T\d{6}Z-\d+-\d+$/i,"");
function safe(s){return s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/&/g," and ").replace(/\+/g," plus ").replace(/#/g," no ").replace(/%/g," percent ").replace(/[^A-Za-z0-9._ -]+/g,"").replace(/\s+/g,"-").replace(/-{2,}/g,"-").replace(/^[-.]+|[-.]+$/g,"").slice(0,80)||"item"}
function safePath(rel,used){const p=rel.split("/"),n=p.pop(),i=n.lastIndexOf("."),ext=i>0?n.slice(i).toLowerCase().replace(/[^a-z0-9.]/g,""):"",base=safe(i>0?n.slice(0,i):n),dir=p.map(s=>safe(takeout(s))).join("/"),pre=dir?dir+"/":"";let out=pre+base+ext,k=2;while(used.has(out.toLowerCase()))out=pre+base+"-"+(k++)+ext;used.add(out.toLowerCase());return out}
function detect(rel){
 const parts=rel.split("/"),name=parts.pop(),segs=parts.map(takeout),all=segs.concat([name]);
 const r={prog:"",yr:"",sm:"All",type:"Study materials",course:"",guess:false};
 segs.concat([name.replace(/\.[^.]+$/,"")]).forEach(function(s,ix){const t=s.toLowerCase().replace(/[_-]+/g," ").trim();
  if(!r.prog){if(/^(all|general|common)\b/.test(t))r.prog="All";else{for(const k in ALIAS)if((" "+t+" ").includes(" "+k.toLowerCase()+" ")){r.prog=ALIAS[k];break}
   if(!r.prog)for(let i=0;i<PK.length;i++)if(PK[i][1].test(t)){r.prog=PK[i][0];break}
   }}
  let m;if(!r.yr){if(m=t.match(/(?:^|[^a-z])(?:year|yr|y)\s*([1-4])(?!\d)/)||t.match(/\blevel\s*([1-4])00\b/)||t.match(/^l?([1-4])00(\s*level)?$/))r.yr=m[1];else if(m=t.match(/\b(first|second|third|fourth|1st|2nd|3rd|4th)\s*year\b/))r.yr={first:1,second:2,third:3,fourth:4,"1st":1,"2nd":2,"3rd":3,"4th":4}[m[1]]+""}
  if(r.sm==="All"){if(m=t.match(/(?:^|[^a-z])(?:sem(?:ester)?|s)\s*([12])(?!\d)/))r.sm=m[1];else if(m=t.match(/\b(first|1st|second|2nd)\s*sem/))r.sm=/^(first|1st)/.test(m[1])?"1":"2"}
  if(ix<segs.length&&!r.course&&CC.test(s)&&!/year|level|sem|^l?[1-4]00$/.test(t))r.course=s.replace(/[_]+/g," ").trim()});
 const FUZZSKIP=new Set(["materials","resources","academic","courses","course","engineering","engineers","files","folder"]);
 if(!r.prog){for(const s of segs.concat([name.replace(/\.[^.]+$/,"")])){const t=s.toLowerCase().replace(/[_-]+/g," ").trim();t.split(" ").forEach(w=>{if(!r.prog&&w.length>=5&&!FUZZSKIP.has(w))for(const st of STEMS)if(lev(w,st[0])<=(w.length>=9?2:1)){r.prog=st[1];break}});if(r.prog)break}}
 const isYS=t=>/(?:^|[^a-z])(?:year|yr|y|sem(?:ester)?|s)\s*[1-4](?!\d)|\blevel\s*[1-4]00\b|^l?[1-4]00(\s*level)?$|\b(first|second|third|fourth|1st|2nd|3rd|4th)\s*(year|sem)/.test(t);
 let last=-1;segs.forEach((s,i)=>{if(isYS(s.toLowerCase().replace(/[_-]+/g," ")))last=i});
 const lo=all.join(" ").toLowerCase();
 if(/time ?table|schedule/.test(lo))r.type="Timetables";else if(/past ?(?:q|paper)|\bpq\b|exam|quiz|mid ?sem|trial|\btest\b|questions?/.test(lo))r.type="Past questions";
 const nm=name.replace(/\.[^.]+$/,"").replace(/[_]+/g," ").replace(/\s+/g," ").trim();
 if(!r.course){const m2=nm.match(CC);if(m2)r.course=m2[0].replace(/^([A-Za-z]+)\s?-?\s?(\d)/,"$1 $2")}
 if(!r.course){for(let i=segs.length-1;i>=0;i--){const t=segs[i].toLowerCase();if(!/^(resources?|files?|uploads?|folder|new folder|documents?|my files)$/.test(t)&&!/year|level|sem|^l?\d00|past|slide|note|material|time ?table|exam|lecture|video|pdf|academic/.test(t)&&((last>=0&&i>last)||PK.every(p=>!p[1].test(t.replace(/[_-]+/g," "))))&&!/^(all|general|common)/.test(t)){r.course=segs[i].replace(/[_]+/g," ").trim();break}}}
 const cm=(r.course+" "+nm).match(CC);
 if(cm){if(!r.yr&&/^[1-4]/.test(cm[1])){r.yr=cm[1][0];r.guess=true}if(r.sm==="All"&&/[12]$/.test(cm[1])){r.sm=cm[1][2];r.guess=true}}
 if(r.sm==="All"){const m3=nm.toLowerCase().match(/\b(?:sem(?:ester)?)\s*([12])\b/);if(m3)r.sm=m3[1]}
 if(r.prog==="All"&&!r.yr)r.yr="All";
 r.look=!r.prog||!r.yr||r.guess;r.prog=r.prog||"All";r.yr=r.yr||"All";r.title=nm;return r}

const A=process.argv.slice(2),BOOL=["dry-run","no-push"];
const flag=(n,d)=>{const i=A.indexOf("--"+n);return i<0?d:typeof d==="number"?+A[i+1]:A[i+1]};
const has=n=>A.includes("--"+n);
const pos=A.filter((a,i)=>!a.startsWith("--")&&!(i>0&&A[i-1].startsWith("--")&&!BOOL.includes(A[i-1].slice(2))));
const die=m=>{console.error("\nStopped: "+m+"\n");process.exit(1)};
const git=(...a)=>execFileSync("git",a,{stdio:"inherit"});
const today=()=>new Date().toISOString().slice(0,10);
const walk=(d,o=[])=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.isFile())o.push(p)}return o};
const csv=(f,head,rows)=>{if(!rows.length)return;fs.mkdirSync("hub-report",{recursive:true});try{if(!fs.readFileSync(".gitignore","utf8").includes("hub-report"))fs.appendFileSync(".gitignore","\nhub-report/\n")}catch(e){fs.writeFileSync(".gitignore","hub-report/\n")}fs.writeFileSync(path.join("hub-report",f),"\ufeff"+[head,...rows].map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\r\n"))};
function parseCsv(t){const rows=[];let r=[],c="",q=false;for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}else if(ch==='"')q=true;else if(ch===","){r.push(c);c=""}else if(ch==="\n"||ch==="\r"){if(ch==="\r"&&t[i+1]==="\n")i++;r.push(c);c="";rows.push(r);r=[]}else c+=ch}if(c||r.length){r.push(c);rows.push(r)}return rows}
const rf="resources.json";
if(!fs.existsSync(rf))die("run this from your project folder (the one that contains resources.json).");
const NOPUSH=has("no-push")||has("dry-run");
if(!NOPUSH){try{execFileSync("git",["rev-parse","--is-inside-work-tree"],{stdio:"ignore"})}catch(e){die("this folder is not a git project. Clone your GitHub project first, or add --no-push.")}}
const data=JSON.parse(fs.readFileSync(rf,"utf8").replace(/,\s*([\]}])/g,"$1"));data.resources=data.resources||[];data.notices=data.notices||[];
const save=()=>{const w=a=>a.map(x=>"    "+JSON.stringify(x)).join(",\n");fs.writeFileSync(rf,`{\n  "_help": ${JSON.stringify(data._help||"")},\n  "resources": [\n${w(data.resources)}\n  ],\n  "notices": [\n${w(data.notices)}\n  ]\n}\n`)};
const publish=msg=>{if(NOPUSH)return;git("add","files",rf);git("commit","-m",msg);git("push")};
if(!NOPUSH){try{git("push")}catch(e){}}

if(pos[0]==="videos"){
 if(!pos[1]||!fs.existsSync(pos[1]))die('give the videos file, e.g.  node hub-sync.mjs videos hub-report/videos-to-upload.csv');
 const have=new Set(data.resources.map(x=>x.link)),add=[];
 parseCsv(fs.readFileSync(pos[1],"utf8").replace(/^\ufeff/,"")).slice(1).forEach(r=>{const link=(r[7]||"").trim();if(!/^https?:\/\//i.test(link)||have.has(link))return;
  add.push({type:"Videos",programme:r[1]||"All",year:r[2]==="All"||!r[2]?"All":+r[2],semester:r[3]==="All"||!r[3]?"All":+r[3],course:r[4]||"",title:r[5]||"Untitled",link,note:"",date:today()})});
 if(!add.length)die("no rows have a YouTube link filled in yet (last column).");
 data.resources=[...add,...data.resources];save();publish("Add "+add.length+" videos");console.log("Added "+add.length+" videos.");process.exit(0)}


// ======== RULES + REVIEW / APPLY / FIX (clean up what is already on the site) ========
const TYPES=["Timetables","Past questions","Study materials","Videos","Opportunities","News"];
let RULES={spelling:{},remove:[],place:[]};
if(fs.existsSync("hub-rules.json")){try{const x=JSON.parse(fs.readFileSync("hub-rules.json","utf8"));RULES={spelling:x.spelling||{},remove:x.remove||[],place:x.place||[]}}catch(e){die("hub-rules.json is not valid JSON. Check the commas and quotes.")}}
const norm=s=>String(s||"").toLowerCase().replace(/[-_]+/g," ").replace(/\s+/g," ").trim();
const wild=p=>new RegExp(norm(p).replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*"));
const caseLike=(m,r)=>m===m.toUpperCase()&&m.length>1?r.toUpperCase():m[0]===m[0].toUpperCase()&&r===r.toLowerCase()?r[0].toUpperCase()+r.slice(1):r;
function respell(t,map){let o=String(t||"");for(const w in map){o=o.replace(new RegExp("\\b"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","gi"),m=>caseLike(m,map[w]))}return o}
function dl(a,b){const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++){d[i]=[i];for(let j=1;j<=n;j++)d[i][j]=i?0:j}
 for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const c=a[i-1]===b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}return d[m][n]}
function autoTypos(list){const f={},add=s=>(String(s||"").toLowerCase().match(/[a-z]{4,}/g)||[]).forEach(w=>f[w]=(f[w]||0)+1);
 list.forEach(x=>{add(x.title);add(x.course)});const ws=Object.keys(f),good=ws.filter(w=>f[w]>=3),out={};
 for(const w of ws){if(f[w]>2||w.length<5)continue;let best="",bd=9;
  for(const g of good){if(g===w||Math.abs(g.length-w.length)>2||g+"s"===w||w+"s"===g)continue;const d=dl(w,g);if(d<bd&&d<=(w.length>=9?2:1)&&f[g]>=f[w]*3){bd=d;best=g}}
  if(best)out[w]=best}
 return out}
function dropFile(link){if(!/^files\//.test(link||"")||!fs.existsSync(link))return false;if(data.resources.some(x=>x.link===link))return false;
 try{fs.unlinkSync(link)}catch(e){return false}let d=path.dirname(link);while(d&&d!=="files"&&d!=="."){try{if(fs.readdirSync(d).length)break;fs.rmdirSync(d)}catch(e){break}d=path.dirname(d)}return true}
const okProg=v=>{const t=String(v||"").trim();if(!t)return"";if(/^all$/i.test(t))return"All";return PR.find(p=>p.toLowerCase()===t.toLowerCase())||""};
const okType=v=>TYPES.find(t=>t.toLowerCase()===String(v||"").trim().toLowerCase())||"";
const YES=/^(y|yes|x|1|true|remove|delete)$/i;

if(pos[0]==="review"){
 const ty=autoTypos(data.resources),seen={},rows=[];
 data.resources.forEach(x=>{const k=norm(x.programme+x.course+x.title);seen[k]=(seen[k]||0)+1});
 data.resources.forEach(x=>{const n=[];for(const w of(norm(x.title+" "+x.course).match(/[a-z]{4,}/g)||[]))if(ty[w])n.push("check spelling: "+w+" -> "+ty[w]);
  if(x.programme==="All")n.push("programme is All (shown to everyone)");if(!x.course&&x.type!=="Timetables")n.push("no course name");if(seen[norm(x.programme+x.course+x.title)]>1)n.push("duplicate?");
  rows.push(["",x.programme,x.year,x.semester,x.type,x.course||"",x.title,x.link,[...new Set(n)].join("; ")])});
 if(!rows.length)die("there is nothing on the site yet.");
 csv("review.csv",["remove (type Y to delete)","programme","year","semester","type","course","title","link (do not change)","notes"],rows);
 console.log("\nSaved hub-report/review.csv with "+rows.length+" rows.\nOpen it in Excel or Google Sheets. Fix spelling, change programme/year/semester/type, and type Y in the first column to delete a file.\nSave as CSV, then run:  node hub-sync.mjs apply hub-report/review.csv\n");process.exit(0)}

if(pos[0]==="apply"){
 if(!pos[1]||!fs.existsSync(pos[1]))die("give the file, e.g.  node hub-sync.mjs apply hub-report/review.csv");
 const rows=parseCsv(fs.readFileSync(pos[1],"utf8").replace(/^\ufeff/,"")).slice(1),by={};data.resources.forEach(x=>by[x.link]=x);
 let ch=0,rm=0,del=0,bad=[];const del_=new Set();
 for(const r of rows){const link=(r[7]||"").trim(),x=by[link];if(!x)continue;
  if(YES.test((r[0]||"").trim())){del_.add(link);rm++;continue}
  const np=r[1]===undefined||r[1]===""?x.programme:okProg(r[1]),yr=/^all$/i.test((r[2]||"").trim())||r[2]===""?"All":+r[2],sm=/^all$/i.test((r[3]||"").trim())||r[3]===""?"All":+r[3],ty=r[4]?okType(r[4]):x.type;
  if(!np){bad.push(link+": unknown programme '"+r[1]+"'");continue}if(!ty){bad.push(link+": unknown type '"+r[4]+"'");continue}
  if(yr!=="All"&&![1,2,3,4].includes(yr)){bad.push(link+": year must be All, 1, 2, 3 or 4");continue}if(sm!=="All"&&![1,2].includes(sm)){bad.push(link+": semester must be All, 1 or 2");continue}
  const nw={programme:np,year:yr,semester:sm,type:ty,course:(r[5]||"").trim(),title:(r[6]||"").trim()||x.title};let c=false;
  for(const k in nw)if(x[k]!==nw[k]){x[k]=nw[k];c=true}if(c)ch++}
 if(bad.length){console.log("\nThese rows were NOT changed, please fix them in the spreadsheet:\n - "+bad.join("\n - "))}
 data.resources=data.resources.filter(x=>!del_.has(x.link));
 if(!has("dry-run")){for(const l of del_)if(dropFile(l))del++;save();publish("Clean up resources: "+ch+" edited, "+rm+" removed")}
 console.log(`\n${has("dry-run")?"Preview only. ":""}Edited: ${ch}\nRemoved from the site: ${rm}\nFiles deleted from the files folder: ${has("dry-run")?"(not in preview)":del}\n`);process.exit(0)}

if(pos[0]==="fix"){
 const ty=has("auto-spell")?autoTypos(data.resources):{},log=[];let ch=0,rm=0;const gone=new Set();
 for(const x of data.resources){const key=norm(x.link+" "+x.title+" "+x.course);
  if(RULES.remove.some(p=>wild(p).test(key))){gone.add(x.link);log.push(["removed",x.title,"","matched a remove rule"]);rm++;continue}
  for(const f of["title","course"]){const a=x[f]||"";let b=respell(a,RULES.spelling);b=respell(b,ty);if(b!==a){x[f]=b;log.push(["spelling ("+f+")",a,b,""]);ch++}}
  for(const pl of RULES.place)if(pl.match&&wild(pl.match).test(key)){const nw={};if(pl.programme&&okProg(pl.programme))nw.programme=okProg(pl.programme);if(pl.year!==undefined)nw.year=pl.year;if(pl.semester!==undefined)nw.semester=pl.semester;if(pl.type&&okType(pl.type))nw.type=okType(pl.type);if(pl.course!==undefined)nw.course=pl.course;
   for(const k in nw)if(x[k]!==nw[k]){log.push(["moved ("+k+")",x.title,String(x[k])+" -> "+nw[k],pl.match]);x[k]=nw[k];ch++}}}
 data.resources=data.resources.filter(x=>!gone.has(x.link));
 csv("fix-log.csv",["what","before","after","rule"],log);
 log.slice(0,40).forEach(l=>console.log("  "+l[0]+": "+l[1]+(l[2]?"  =>  "+l[2]:"")));if(log.length>40)console.log("  ... and "+(log.length-40)+" more (see hub-report/fix-log.csv)");
 let del=0;if(!has("dry-run")&&(ch||rm)){for(const l of gone)if(dropFile(l))del++;save();publish("Fix resources: "+ch+" changed, "+rm+" removed")}
 console.log(`\n${has("dry-run")?"Preview only. ":""}Changed: ${ch}\nRemoved: ${rm}\nFiles deleted: ${has("dry-run")?"(not in preview)":del}\n`+(has("auto-spell")?"":"Tip: add --auto-spell to also fix likely typos automatically.\n"));process.exit(0)}

if(!pos[0]||!fs.existsSync(pos[0])||!fs.statSync(pos[0]).isDirectory())die('give the folder to read, e.g.  node hub-sync.mjs "C:\\Users\\me\\Resources"');
const src=path.resolve(pos[0]),base=path.dirname(src);
const MAXF=flag("max-file-mb",95)*MB,BUDGET=flag("budget-mb",900)*MB,BF=flag("batch-files",200),BM=flag("batch-mb",250)*MB;
let ov={};for(const p of ["hub-overrides.json",path.join(src,"hub-overrides.json")])if(fs.existsSync(p)){try{ov=JSON.parse(fs.readFileSync(p,"utf8"));break}catch(e){die(p+" is not valid JSON.")}}
if(fs.existsSync("hub-aliases.json")){try{ALIAS=JSON.parse(fs.readFileSync("hub-aliases.json","utf8"))}catch(e){die("hub-aliases.json is not valid JSON.")}}
const have=new Set(data.resources.map(x=>x.link)),used=new Set(),cand=[];
let total=fs.existsSync("files")?walk("files").reduce((a,f)=>a+fs.statSync(f).size,0):0;
const R={videos:[],big:[],over:[],renamed:[],look:[],skipped:0,dups:0},plan=[];
for(const f of walk(src).sort()){
 const rel=path.relative(base,f).split(path.sep).join("/"),name=path.basename(f);
 if(SKIP.test(name)||/^hub-overrides\.json$/i.test(name)){R.skipped++;continue}
 const o=ov[rel]||{};if(o.skip){R.skipped++;continue}
 const st=fs.statSync(f),d=Object.assign(detect(rel),o);
 if(RULES.remove.some(p=>wild(p).test(norm(rel)))){R.skipped++;continue}
 d.title=respell(d.title,RULES.spelling);d.course=respell(d.course,RULES.spelling);
 for(const pl of RULES.place)if(pl.match&&wild(pl.match).test(norm(rel))){if(pl.programme&&okProg(pl.programme))d.prog=okProg(pl.programme);if(pl.year!==undefined)d.yr=String(pl.year);if(pl.semester!==undefined)d.sm=String(pl.semester);if(pl.type&&okType(pl.type))d.type=okType(pl.type);if(pl.course!==undefined)d.course=pl.course;d.look=false}
 if(VID.test(name)){R.videos.push([rel,d.prog,d.yr,d.sm,d.course,d.title,mb(st.size),""]);continue}
 if(st.size>MAXF){R.big.push([rel,mb(st.size)]);continue}
 const clean=safePath(rel,used),link="files/"+clean;
 if(have.has(link)){R.dups++;continue}
 cand.push({rel,f,link,size:st.size,d,o,entry:{type:d.type,programme:d.prog,year:d.yr==="All"?"All":+d.yr,semester:d.sm==="All"?"All":+d.sm,course:(d.course||"").trim(),title:(d.title||"").trim()||"Untitled",link,note:mb(st.size),date:today()}})}
const rank={Timetables:0,"Past questions":1};
cand.sort((a,b)=>(rank[a.entry.type]??2)-(rank[b.entry.type]??2)||a.size-b.size);
for(const c of cand){if(total+c.size>BUDGET){R.over.push([c.rel,mb(c.size)]);continue}total+=c.size;if(UNSAFE.test(c.rel))R.renamed.push([c.rel,c.link]);if(c.d.look&&!c.o.prog)R.look.push([c.rel,c.d.prog,c.d.yr,c.d.sm]);plan.push(c)}
csv("videos-to-upload.csv",["file","programme","year","semester","course","title","size","youtube_link"],R.videos);
csv("too-big.csv",["file","size"],R.big);csv("over-budget.csv",["file","size"],R.over);
csv("names-cleaned.csv",["original","saved_as"],R.renamed);csv("check-these.csv",["file","programme_used","year_used","semester_used"],R.look);
try{if(!fs.readFileSync(".gitignore","utf8").includes("hub-report"))fs.appendFileSync(".gitignore","\nhub-report/\n")}catch(e){fs.writeFileSync(".gitignore","hub-report/\n")}
const n=plan.length,bytes=plan.reduce((a,p)=>a+p.size,0);
console.log(`\nReady to add: ${n} files (${mb(bytes)})\nVideos set aside: ${R.videos.length}\nNames cleaned: ${R.renamed.length}\nGuesses to check: ${R.look.length}\nToo big for GitHub: ${R.big.length}\nOver the size budget: ${R.over.length}\nAlready on the site: ${R.dups}\nReports saved in the hub-report folder.\n`);
if(has("dry-run")||!n)process.exit(0);
const batches=[];let cur=[],cf=0,cb=0;
for(const p of plan){if(cur.length&&(cf>=BF||cb+p.size>BM)){batches.push(cur);cur=[];cf=cb=0}cur.push(p);cf++;cb+=p.size}if(cur.length)batches.push(cur);
batches.forEach((b,i)=>{
 console.log(`Batch ${i+1} of ${batches.length}: ${b.length} files`);
 for(const p of b){const to=p.link;fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(p.f,to)}
 data.resources=[...b.map(p=>p.entry),...data.resources];save();
 try{publish(`Add resources (batch ${i+1} of ${batches.length})`)}catch(e){die(`could not upload batch ${i+1}. Check your internet and GitHub sign-in, then run the same command again. It continues where it stopped.`)}});
console.log("\nDone. Your site updates in a minute or two.");
