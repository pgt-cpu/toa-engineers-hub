/* TOA Engineers Hub: reads the "files" folder and writes resources.auto.json.
   Folder rule:  files/<Programme>/<Year>/<Semester (optional)>/<Course (optional)>/<Type (optional)>/<file>
   Runs automatically on every Vercel deploy (see vercel.json). No forms, no typing. */
const fs=require("fs"),path=require("path"),cp=require("child_process");
const ROOT=path.resolve(__dirname,".."),FILES=path.join(ROOT,"files");
const PROG={"Aerospace":["aerospace"],"Agricultural":["agricultural","agric"],"Automobile":["automobile","automotive"],"Biomedical":["biomedical"],"Chemical":["chemical"],"Civil":["civil"],"Computer":["computer","computer engineering","comp"],"Electrical & Electronic":["electrical electronic","electrical electronics","electrical","electronic","eee","electrical and electronic","electrical and electronics"],"Geological":["geological"],"Geomatic":["geomatic","geomatics"],"Industrial":["industrial"],"Marine":["marine"],"Materials":["materials","material"],"Mechanical":["mechanical"],"Metallurgical":["metallurgical"],"Petrochemical":["petrochemical"],"Petroleum":["petroleum"],"Telecommunication":["telecommunication","telecommunications","telecom"]};
const STOP=/\b(engineering|eng|department|dept|of|bsc|programme|program|the|and)\b/g;
const clean=s=>s.toLowerCase().replace(/&/g," and ").replace(/[_\-.()\[\]]+/g," ").replace(/\s+/g," ").trim();
const base=s=>clean(s).replace(STOP," ").replace(/\s+/g," ").trim();
const ALIAS={};Object.keys(PROG).forEach(p=>PROG[p].forEach(a=>ALIAS[base(a)]=p));
const COMMON=new Set(["common","all","general","everyone","all programmes","all programs","first year","1st year","engineering common","common courses"]);
const WORDYEAR={first:1,"1st":1,second:2,"2nd":2,third:3,"3rd":3,fourth:4,"4th":4,final:4};
function yearOf(seg){const s=clean(seg);let m;
 if(m=/^(?:year|yr|level|lvl)\s*([1-4])$/.exec(s))return+m[1];
 if(m=/^([1-4])(?:st|nd|rd|th)?\s*(?:year|yr)$/.exec(s))return+m[1];
 if(m=/^y\s*([1-4])$/.exec(s))return+m[1];
 if(m=/^(?:level\s*)?([1-4])00(?:\s*level)?$/.exec(s))return+m[1];
 if(m=/^(first|second|third|fourth|final|1st|2nd|3rd|4th)\s*year$/.exec(s))return WORDYEAR[m[1]];
 return 0}
function semOf(seg){const s=clean(seg);let m;
 if(m=/^(?:semester|sem|sm)\s*([12])$/.exec(s))return+m[1];
 if(m=/^s\s*([12])$/.exec(s))return+m[1];
 if(m=/^(first|second|1st|2nd)\s*(?:semester|sem)$/.exec(s))return /first|1st/.test(m[1])?1:2;
 if(m=/^([12])(?:st|nd)?\s*(?:semester|sem)$/.exec(s))return+m[1];
 return 0}
const CODE=/\b([a-z]{2,5})\s?-?\s?(\d{3})\b/i;
function courseOf(seg){const m=CODE.exec(seg);if(!m)return"";const code=(m[1]+" "+m[2]).toUpperCase();
 const rest=seg.replace(CODE,"").replace(/[_\-.()]+/g," ").replace(/\s+/g," ").trim();return rest?code+" "+rest:code}
function typeOf(txt){const s=clean(txt);
 if(/time ?table|schedule/.test(s))return"Timetables";
 if(/worked solution|solution|solved|answers?\b/.test(s))return"Solutions";
 if(/past question|past paper|\bpq\b|exam question|exam paper|questions?\b|\bexams?\b|mid ?sem|quiz|trial/.test(s))return"Past questions";
 if(/video|recording/.test(s))return"Videos";
 if(/opportunit|scholarship|internship|\bjobs?\b/.test(s))return"Opportunities";
 if(/^news$|announcement/.test(s))return"News";
 return""}
function catOf(txt){const s=clean(txt);
 if(/worked solution|solution|solved|answers?\b/.test(s))return"Worked solutions";
 if(/lecture note|notes?\b|slides?|lecture/.test(s))return"Lecture notes";
 if(/reference|textbook|handbook|formula/.test(s))return"Reference";
 if(/course material|materials?\b|handout|outline/.test(s))return"Course materials";
 return""}
function examYear(txt){let m=/\b(20\d\d)\s*[-\/_]\s*(20\d\d)\b/.exec(txt);if(m)return m[1]+"/"+m[2];m=/\b(20\d\d|19[89]\d)\b/.exec(txt);return m?m[1]:""}
function walk(d,o){fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{if(e.name[0]==="."||e.name[0]==="_")return;const p=path.join(d,e.name);if(e.isDirectory())walk(p,o);else o.push(p)});return o}
function gitDates(){const m={};try{const out=cp.execSync('git -c core.quotepath=off log --name-only --format="@%cs" -- files',{cwd:ROOT,stdio:["ignore","pipe","ignore"],maxBuffer:64*1024*1024}).toString();let d="";out.split("\n").forEach(l=>{if(l[0]==="@")d=l.slice(1);else if(l&&!m[l])m[l]=d})}catch(e){}return m}
const OK=/\.(pdf|pptx?|docx?|xlsx?|png|jpe?g|webp|mp4|txt)$/i;
function build(){
 if(!fs.existsSync(FILES)){console.log('No "files" folder found. Nothing to build.');return{resources:[],notes:[]}}
 const dates=gitDates(),res=[],notes=[];
 walk(FILES,[]).sort().forEach(abs=>{
  if(!OK.test(abs))return;const rel=path.relative(FILES,abs).split(path.sep),name=rel[rel.length-1],dirs=rel.slice(0,-1);
  let prog="All",year=0,sem=0,course="",rest=[];
  dirs.forEach((seg,i)=>{const b=base(seg),cl=clean(seg);
   if(i<=1&&ALIAS[b]&&prog==="All"){prog=ALIAS[b];return}
   if(i<=1&&COMMON.has(cl)){prog="All";if(/first|1st/.test(cl))year=year||1;return}
   const y=yearOf(seg);if(y&&!year){year=y;return}
   const s=semOf(seg);if(s&&!sem){sem=s;return}
   rest.push(seg)});
  let stem=name.replace(/\.[^.]+$/,""),tags=(stem.match(/\((?:verified|important|new)\)|★/gi)||[]).join(" ").toLowerCase();
  stem=stem.replace(/\((?:verified|important|new)\)|★/gi,"").trim();
  rest.forEach(seg=>{if(!course){const c=courseOf(seg);if(c)course=c}});
  if(!course){const c=courseOf(stem);if(c)course=c.split(" ").slice(0,2).join(" ")}
  const ctx=rest.join(" / ")+" / "+stem;
  let type=typeOf(rest.join(" / "))||typeOf(stem),cat="";
  if(type==="Solutions"||(!type&&catOf(ctx)==="Worked solutions")){type="Study materials";cat="Worked solutions"}
  else if(!type){type=/\.mp4$/i.test(name)?"Videos":"Study materials"}
  if(type==="Study materials"&&!cat)cat=catOf(rest.join(" / "))||catOf(stem);
  const ey=(type==="Past questions"||cat==="Worked solutions")?examYear(ctx):"";
  let title=stem.replace(CODE,"").replace(/[_]+/g," ").replace(/\s+/g," ").trim()||(course||type);
  if(!/\s/.test(title)&&/^[a-z0-9-]+$/i.test(title))title=title.replace(/-/g," ");
  const link="files/"+rel.map(encodeURIComponent).join("/");
  const r={type,programme:prog,year:year||"All",semester:sem||"All",course,title,link,note:"",date:dates["files/"+rel.join("/")]||""};
  if(cat)r.category=cat;if(ey)r.examYear=ey;if(/important|★/.test(tags))r.important=true;if(/verified/.test(tags))r.verified=true;if(/\(new\)/.test(tags))r.date=new Date().toISOString().slice(0,10);
  res.push(r);
  const w=[];if(prog==="All"&&!COMMON.has(clean(dirs[0]||"")))w.push("no programme found (treated as All)");if(!year)w.push("no year found (treated as All)");if(w.length)notes.push(rel.join("/")+": "+w.join("; "))});
 return{resources:res,notes}}
if(require.main===module){const o=build();fs.writeFileSync(path.join(ROOT,"resources.auto.json"),JSON.stringify({generated:new Date().toISOString(),count:o.resources.length,resources:o.resources},null,1));
 console.log("Hub build: "+o.resources.length+" files found in the files folder.");o.notes.slice(0,40).forEach(n=>console.log("  note: "+n))}
module.exports={build};
