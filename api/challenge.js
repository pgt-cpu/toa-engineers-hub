/* PUBLIC endpoint for students: read the live challenge, submit an answer, see results and leaderboards. Correct answers never leave the server before the challenge is finalised. */
const L=require("./_lib");
const PID=/^[a-z0-9]{6,40}$/;
module.exports=async function(req,res){
 try{
  if(!L.configured())return L.send(res,200,{on:false});
  const db=L.fb(),q=req.query||{},a=q.a||"current";
  if(req.method==="POST"&&a==="submit"){
   const b=req.body&&typeof req.body==="object"?req.body:{};const pid=String(b.pid||"");
   if(!PID.test(pid))return L.send(res,400,{err:"Join the leaderboard first."});
   const player=await db.get("players/"+pid);if(!player||!player.n)return L.send(res,400,{err:"Join the leaderboard first."});
   const id=await db.get("ch/live"),it=id&&await db.get("ch/items/"+id);
   if(!it||it.status!=="live")return L.send(res,409,{err:"There is no open challenge right now."});
   const now=Date.now();if(now<Date.parse(it.opensAt)||now>=Date.parse(it.closesAt))return L.send(res,409,{err:"This challenge is closed."});
   const ans=String(b.answer==null?"":b.answer).slice(0,200).trim();if(!ans)return L.send(res,400,{err:"Type or choose an answer."});
   const ex=String(b.explanation||"").slice(0,600).trim();
   const rec={n:String(player.n).slice(0,20),a:ans,e:ex,t:now,ok:L.evaluate(it,ans),bonus:0};
   const okw=await db.putIfNull("ch/sub/"+id+"/"+pid,rec);if(!okw)return L.send(res,409,{err:"You already submitted for this challenge.",submitted:true});
   return L.send(res,200,{ok:true,submitted:true,closesAt:it.closesAt})}
  if(a==="current"){
   let id=await db.get("ch/live"),it=id&&await db.get("ch/items/"+id);
   if(it&&Date.now()>=Date.parse(it.closesAt)+L.RULES.graceHours*36e5){await L.finalize(id,false);id=await db.get("ch/live");it=id&&await db.get("ch/items/"+id)}
   const pid=String(q.pid||""),out={on:true,rules:L.RULES,cats:L.CATS};
   if(it&&it.status==="live"){out.challenge=L.publicItem(it);out.open=Date.now()>=Date.parse(it.opensAt)&&Date.now()<Date.parse(it.closesAt);if(PID.test(pid))out.submitted=!!(await db.get("ch/sub/"+id+"/"+pid))}
   const res_=await db.get("ch/res");if(res_){const ids=Object.keys(res_).filter(k=>res_[k]&&res_[k].done).sort((x,y)=>(res_[y].at||0)-(res_[x].at||0));if(ids[0]){const r=res_[ids[0]];out.last={id:r.id,seq:r.seq,category:r.category,question:r.question,answer:r.answer,explanation:r.explanation,count:r.count,winners:r.winners,top:r.top};if(PID.test(pid)){const w=await db.get("ch/week/"+ids[0]+"/"+pid);if(w)out.last.mine=w.pts}}}
   return L.send(res,200,out)}
  if(a==="past"){const r=(await db.get("ch/res"))||{};const list=Object.keys(r).map(k=>r[k]).filter(x=>x&&x.done).sort((x,y)=>y.at-x.at).slice(0,12).map(x=>({id:x.id,seq:x.seq,category:x.category,question:x.question,answer:x.answer,explanation:x.explanation,count:x.count,winners:x.winners}));return L.send(res,200,{past:list})}
  if(a==="board"){
   if(q.scope==="all"){const s=(await db.get("ch/score"))||{};const list=Object.keys(s).map(k=>({n:s[k].n,pts:s[k].tot||0,wins:s[k].wins||0,cnt:s[k].cnt||0,badges:s[k].badges||[]})).sort((x,y)=>y.pts-x.pts||y.wins-x.wins||x.n.localeCompare(y.n)).slice(0,25);return L.send(res,200,{board:list})}
   const r=(await db.get("ch/res"))||{},ids=Object.keys(r).filter(k=>r[k]&&r[k].done).sort((x,y)=>r[y].at-r[x].at);if(!ids[0])return L.send(res,200,{board:[],week:null});
   const w=(await db.get("ch/week/"+ids[0]))||{},list=Object.keys(w).map(k=>({n:w[k].n,pts:w[k].pts})).sort((x,y)=>y.pts-x.pts||x.n.localeCompare(y.n)).slice(0,25);return L.send(res,200,{board:list,week:{seq:r[ids[0]].seq,category:r[ids[0]].category}})}
  if(a==="me"){const pid=String(q.pid||"");if(!PID.test(pid))return L.send(res,200,{});const s=await db.get("ch/score/"+pid);return L.send(res,200,s?{tot:s.tot||0,cnt:s.cnt||0,wins:s.wins||0,badges:s.badges||[]}:{tot:0,cnt:0,wins:0,badges:[]})}
  return L.send(res,404,{err:"unknown"})
 }catch(e){return L.send(res,500,{err:"Something went wrong. Try again."})}
};
