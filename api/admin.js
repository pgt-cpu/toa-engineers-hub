/* ADMIN endpoint. Every action except "login" needs a valid signed token. The password lives only in Vercel settings. */
const L=require("./_lib"),crypto=require("crypto");
const DIFF=["easy","medium","hard"],TYPES=["mcq","number","text","open"];
function clean(x,id){
 const e=[],it={id:id,category:String(x.category||""),difficulty:String(x.difficulty||"medium").toLowerCase(),type:String(x.type||"").toLowerCase(),question:String(x.question||"").trim(),explanation:String(x.explanation||"").trim(),subject:String(x.subject||x.category||"")};
 if(L.CATS.indexOf(it.category)<0)e.push("category must be one of: "+L.CATS.join("; "));
 if(DIFF.indexOf(it.difficulty)<0)e.push("difficulty must be easy, medium or hard");
 if(TYPES.indexOf(it.type)<0)e.push("type must be mcq, number, text or open");
 if(it.question.length<10||it.question.length>800)e.push("question needs 10 to 800 characters");
 if(it.type==="mcq"){it.options=(x.options||[]).map(o=>String(o).trim()).filter(Boolean);if(it.options.length<2||it.options.length>6)e.push("mcq needs 2 to 6 options");it.answer=Number(x.answer);if(!Number.isInteger(it.answer)||it.answer<0||it.answer>=it.options.length)e.push("answer must be the number of the correct option, starting at 0")}
 else if(it.type==="number"){it.answer=parseFloat(x.answer);if(!isFinite(it.answer))e.push("answer must be a number");it.tolerance=x.tolerance==null||x.tolerance===""?0.01:Math.abs(+x.tolerance)}
 else if(it.type==="text"){it.answer=String(x.answer||"").trim();it.accepted=(x.accepted||[]).map(s=>String(s).trim()).filter(Boolean);if(!it.answer)e.push("answer is required")}
 else{it.answerText=String(x.answerText||x.answer||"").trim()}
 if(it.type!=="open"&&!it.explanation)e.push("write the explanation (students see it after the challenge closes)");
 it.points={correct:+(x.points&&x.points.correct)||L.RULES.correct,participation:+(x.points&&x.points.participation)||L.RULES.participation,bonusMax:x.points&&x.points.bonusMax!=null?+x.points.bonusMax:L.RULES.bonusMax};
 return{it,e}}
module.exports=async function(req,res){
 try{
  if(req.method!=="POST")return L.send(res,405,{err:"POST only"});
  if(!process.env.ADMIN_PASSWORD||!L.configured())return L.send(res,503,{err:"Server not set up yet. Add the settings in Vercel (see SETUP)."});
  const b=req.body&&typeof req.body==="object"?req.body:{},db=L.fb();
  if(b.action==="login"){
   const ip=crypto.createHash("sha256").update(String((req.headers&&(req.headers["x-forwarded-for"]||"")).split(",")[0]||"x")).digest("hex").slice(0,16),k="ch/fail/"+ip,f=(await db.get(k))||{n:0,t:Date.now()};
   if(Date.now()-f.t>9e5){f.n=0;f.t=Date.now()}
   if(f.n>=5)return L.send(res,429,{err:"Too many wrong tries. Wait 15 minutes."});
   if(!L.passOk(b.password)){f.n++;await db.put(k,f);return L.send(res,401,{err:"Wrong password."})}
   await db.del(k);return L.send(res,200,{token:L.sign(Date.now()+12*36e5)})}
  if(!L.verify(b.token))return L.send(res,401,{err:"Please sign in again."});
  const act=b.action;
  if(act==="list"){const items=(await db.get("ch/items"))||{};return L.send(res,200,{items:Object.keys(items).map(k=>items[k]).sort((x,y)=>(y.created||0)-(x.created||0)),live:await db.get("ch/live"),cats:L.CATS,rules:L.RULES,players:Object.keys((await db.get("ch/score"))||{}).length})}
  if(act==="save"||act==="import"){
   let arr=act==="import"?b.items:[b.item];if(typeof arr==="string"){try{arr=JSON.parse(arr)}catch(e){return L.send(res,400,{err:"That is not valid JSON: "+e.message})}}
   if(!Array.isArray(arr))arr=[arr];if(!arr.length||arr.length>10)return L.send(res,400,{err:"Send between 1 and 10 questions."});
   const saved=[],errs=[];
   for(let i=0;i<arr.length;i++){const x=arr[i]||{};let id=act==="save"&&x.id?String(x.id):"c"+Date.now().toString(36)+i;
    const old=act==="save"&&x.id?await db.get("ch/items/"+id):null;if(old&&(old.status==="live"||old.status==="closed")){errs.push("Question "+(i+1)+": a live or finished challenge cannot be edited.");continue}
    const c=clean(x,id);if(c.e.length){errs.push("Question "+(i+1)+": "+c.e.join("; "));continue}
    c.it.status="draft";c.it.created=old?old.created:Date.now();c.it.source=act==="import"?"ai":(old&&old.source)||"admin";c.it.opensAt=x.opensAt||"";c.it.closesAt=x.closesAt||"";await db.put("ch/items/"+id,c.it);saved.push(id)}
   if(saved.length)await L.notify("Weekly challenge: "+saved.length+" draft question(s) waiting for your approval."+(process.env.SITE_URL?" "+process.env.SITE_URL+"/admin-challenge.html":""));
   return L.send(res,errs.length&&!saved.length?400:200,{saved,errs})}
  if(["approve","reject","delete","publish","submissions","mark","finalize"].indexOf(act)<0&&act!=="stats")return L.send(res,400,{err:"unknown action"});
  const id=String(b.id||""),it=id&&await db.get("ch/items/"+id);
  if(act!=="stats"&&!it)return L.send(res,404,{err:"Question not found."});
  if(act==="approve"){if(it.status!=="draft")return L.send(res,409,{err:"Only drafts can be approved."});it.status="approved";it.approved=Date.now();await db.put("ch/items/"+id,it);return L.send(res,200,{ok:true})}
  if(act==="reject"){if(it.status==="live"||it.status==="closed")return L.send(res,409,{err:"Cannot reject this one."});it.status="rejected";await db.put("ch/items/"+id,it);return L.send(res,200,{ok:true})}
  if(act==="delete"){if(it.status==="live")return L.send(res,409,{err:"Close the live challenge first."});await db.del("ch/items/"+id);return L.send(res,200,{ok:true})}
  if(act==="publish"){
   if(it.status!=="approved")return L.send(res,409,{err:"Only approved questions can be published."});
   const live=await db.get("ch/live");if(live)return L.send(res,409,{err:"Another challenge is live. Finalise it first."});
   const o=Date.parse(b.opensAt||new Date().toISOString()),c=Date.parse(b.closesAt);if(!isFinite(c)||c<=Math.max(o,Date.now()))return L.send(res,400,{err:"Closing time must be in the future and after the opening time."});
   const seq=((await db.get("ch/seq"))||0)+1;await db.put("ch/seq",seq);it.seq=seq;it.status="live";it.opensAt=new Date(o).toISOString();it.closesAt=new Date(c).toISOString();await db.put("ch/items/"+id,it);await db.put("ch/live",id);
   await L.notify("Weekly challenge published: "+it.category+" ("+it.difficulty+"). Closes "+it.closesAt+".");return L.send(res,200,{ok:true,seq})}
  if(act==="submissions"){const s=(await db.get("ch/sub/"+id))||{};return L.send(res,200,{item:it,subs:Object.keys(s).map(k=>Object.assign({pid:k},s[k])).sort((x,y)=>x.t-y.t)})}
  if(act==="mark"){if(it.status==="closed")return L.send(res,409,{err:"Already finalised."});const s=await db.get("ch/sub/"+id+"/"+b.pid);if(!s)return L.send(res,404,{err:"No such entry."});if(typeof b.ok==="boolean"&&it.type==="open")s.ok=b.ok;if(b.bonus!=null)s.bonus=Math.max(0,Math.min((it.points||L.RULES).bonusMax,Math.round(+b.bonus||0)));await db.put("ch/sub/"+id+"/"+b.pid,s);return L.send(res,200,{ok:true})}
  if(act==="finalize"){if(it.status!=="live")return L.send(res,409,{err:"Only a live challenge can be finalised."});const o=await L.finalize(id,true);return L.send(res,200,o.res?{ok:true,winners:o.res.winners,count:o.res.count}:{ok:false,info:o})}
  if(act==="stats"){return L.send(res,200,{players:Object.keys((await db.get("ch/score"))||{}).length,live:await db.get("ch/live")})}
 }catch(e){return L.send(res,500,{err:"Server error"})}
};
