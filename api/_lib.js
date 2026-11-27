/* Shared helpers for the Hub's secure server functions (Vercel). Secrets come from Vercel environment variables, never from the website files. */
const crypto=require("crypto");
const CATS=["Engineering Mathematics","Logical Reasoning","Physics","Electrical and Electronic Circuits","Mechanical Engineering","Civil Engineering","Binary and Computing","Engineering Riddles","Creative Engineering Problems"];
const RULES={correct:10,participation:2,bonusMax:3,graceHours:6};
let store=null;
function setStore(s){store=s}
function dbBase(){return(process.env.FIREBASE_DB_URL||"").replace(/\/+$/,"")}
function configured(){return!!(store||(dbBase()&&process.env.FIREBASE_DB_SECRET))}
function fb(){
 if(store)return store;
 const u=p=>dbBase()+"/"+p+".json?auth="+encodeURIComponent(process.env.FIREBASE_DB_SECRET||"");
 const call=async(m,p,b,h)=>{const r=await fetch(u(p),{method:m,headers:Object.assign({"Content-Type":"application/json"},h||{}),body:b===undefined?undefined:JSON.stringify(b)});if(r.status===412)return{cond:false};if(!r.ok)throw new Error("db "+r.status);const t=await r.text();return{cond:true,v:t?JSON.parse(t):null}};
 return{get:async p=>(await call("GET",p)).v,put:async(p,v)=>{await call("PUT",p,v)},patch:async(p,v)=>{await call("PATCH",p,v)},del:async p=>{await call("DELETE",p)},putIfNull:async(p,v)=>(await call("PUT",p,v,{"If-Match":"null_etag"})).cond}}
/* tiny in-memory store used by the tests */
function memStore(){const d={};const seg=p=>p.split("/").filter(Boolean);
 const get=p=>{let n=d;for(const k of seg(p)){if(n==null||typeof n!=="object")return null;n=n[k]}return n===undefined?null:JSON.parse(JSON.stringify(n))};
 const put=(p,v)=>{const s=seg(p);let n=d;for(let i=0;i<s.length-1;i++){if(typeof n[s[i]]!=="object"||n[s[i]]===null)n[s[i]]={};n=n[s[i]]}if(v===null)delete n[s[s.length-1]];else n[s[s.length-1]]=JSON.parse(JSON.stringify(v))};
 return{get:async p=>get(p),put:async(p,v)=>put(p,v),patch:async(p,v)=>{Object.keys(v).forEach(k=>put(p+"/"+k,v[k]))},del:async p=>put(p,null),putIfNull:async(p,v)=>{if(get(p)!==null)return false;put(p,v);return true},_d:d}}
function b64(o){return Buffer.from(typeof o==="string"?o:JSON.stringify(o)).toString("base64url")}
function secret(){return process.env.ADMIN_SECRET||crypto.createHash("sha256").update("hub|"+(process.env.ADMIN_PASSWORD||"")).digest("hex")}
function sign(exp){const p=b64({exp});return p+"."+crypto.createHmac("sha256",secret()).update(p).digest("base64url")}
function verify(t){if(!t||typeof t!=="string"||!process.env.ADMIN_PASSWORD)return false;const[p,s]=t.split(".");if(!p||!s)return false;const e=crypto.createHmac("sha256",secret()).update(p).digest("base64url");const a=Buffer.from(s),b=Buffer.from(e);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return false;try{return JSON.parse(Buffer.from(p,"base64url").toString()).exp>Date.now()}catch(e){return false}}
function passOk(pw){const A=crypto.createHash("sha256").update(String(pw||"")).digest(),B=crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD||"\u0000none").digest();return!!process.env.ADMIN_PASSWORD&&crypto.timingSafeEqual(A,B)}
async function notify(text){const t=process.env.TELEGRAM_BOT_TOKEN,c=process.env.TELEGRAM_CHAT_ID;if(!t||!c)return false;try{const r=await fetch("https://api.telegram.org/bot"+t+"/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:c,text:String(text).slice(0,3800)})});return r.ok}catch(e){return false}}
function send(res,code,obj){res.statusCode=code;res.setHeader("Content-Type","application/json");res.setHeader("Cache-Control","no-store");res.end(JSON.stringify(obj))}
function norm(s){return String(s==null?"":s).toLowerCase().normalize("NFKD").replace(/[^a-z0-9.\-\/ ]+/g," ").replace(/\s+/g," ").trim()}
function evaluate(it,ans){
 if(it.type==="open")return null;
 if(it.type==="mcq")return Number(ans)===Number(it.answer)&&ans!==""&&ans!==null;
 if(it.type==="number"){const a=parseFloat(String(ans).replace(/,/g,"")),b=parseFloat(it.answer),t=it.tolerance==null?0.01:Math.abs(+it.tolerance);return isFinite(a)&&isFinite(b)&&Math.abs(a-b)<=t}
 const list=[it.answer].concat(it.accepted||[]).map(norm).filter(Boolean);return list.indexOf(norm(ans))>-1}
function shown(it){if(it.type==="mcq")return(it.options||[])[it.answer];if(it.type==="open")return it.answerText||"Marked by the admin";return String(it.answer)}
function publicItem(it){return{id:it.id,category:it.category,difficulty:it.difficulty,type:it.type,question:it.question,options:it.type==="mcq"?it.options:undefined,opensAt:it.opensAt,closesAt:it.closesAt,seq:it.seq,points:it.points||RULES}}
const rank=(arr)=>arr.sort((a,b)=>b.pts-a.pts||a.n.localeCompare(b.n));
function badges(s){const out=[],seqs=(s.seqs||[]).slice().sort((a,b)=>a-b);let run=0;for(let i=seqs.length-1;i>=0;i--){if(i===seqs.length-1||seqs[i]===seqs[i+1]-1)run++;else break}
 if(s.cnt>=1)out.push("First entry");if((s.right||0)>=3)out.push("Sharp mind");if(run>=3)out.push("Regular");if(run>=5)out.push("On a roll");if((s.wins||0)>=1)out.push("Weekly winner");if((s.wins||0)>=3)out.push("Champion");return out}
async function finalize(id,force){
 const db=fb(),it=await db.get("ch/items/"+id);if(!it)return{err:"not found"};
 if(it.status==="closed"&&await db.get("ch/res/"+id+"/done"))return{already:true};
 const now=Date.now();if(!force&&now<Date.parse(it.closesAt)+RULES.graceHours*36e5)return{early:true};
 if(!(await db.putIfNull("ch/res/"+id+"/lock",now)))return{already:true};
 const pts=it.points||RULES,subs=(await db.get("ch/sub/"+id))||{},list=[];
 for(const pid of Object.keys(subs)){const s=subs[pid],bonus=Math.max(0,Math.min(pts.bonusMax,+s.bonus||0)),p=pts.participation+(s.ok===true?pts.correct:0)+bonus;list.push({pid,n:s.n,pts:p,ok:s.ok===true})}
 rank(list);const top=list.length?list[0].pts:0,winners=top>0?list.filter(x=>x.pts===top):[];
 for(const x of list){const sc=(await db.get("ch/score/"+x.pid))||{n:x.n,tot:0,cnt:0,wins:0,right:0,seqs:[]};sc.n=x.n;sc.tot=(sc.tot||0)+x.pts;sc.cnt=(sc.cnt||0)+1;sc.right=(sc.right||0)+(x.ok?1:0);sc.seqs=(sc.seqs||[]).concat([it.seq||0]);if(winners.some(w=>w.pid===x.pid))sc.wins=(sc.wins||0)+1;sc.badges=badges(sc);await db.put("ch/score/"+x.pid,sc);await db.put("ch/week/"+id+"/"+x.pid,{n:x.n,pts:x.pts})}
 const res={done:true,at:now,id,seq:it.seq||0,category:it.category,question:it.question,answer:shown(it),explanation:it.explanation||"",count:list.length,winners:winners.map(w=>({n:w.n,pts:w.pts})),top:list.slice(0,10).map(x=>({n:x.n,pts:x.pts})),closesAt:it.closesAt};
 await db.put("ch/res/"+id,Object.assign(res,{lock:now}));it.status="closed";await db.put("ch/items/"+id,it);if((await db.get("ch/live"))===id)await db.del("ch/live");
 await notify("Weekly challenge finished: "+it.category+". "+list.length+" entries. Winner(s): "+(winners.map(w=>w.n).join(", ")||"none")+".");return{res}}
module.exports={CATS,RULES,setStore,configured,fb,memStore,sign,verify,passOk,notify,send,evaluate,shown,publicItem,finalize,norm};
