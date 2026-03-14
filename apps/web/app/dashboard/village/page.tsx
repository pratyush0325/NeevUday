"use client";
import { useState, useEffect } from "react";
import { useMyVillageRequests, useVillageStats, useCreateVillageRequest } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { RequestType, RequestUrgency } from "@setu/shared";
import "../../donor-animations.css";

const C = { pageBg:"#ffffff",sidebarBg:"#fafafa",sidebarBorder:"rgba(0,0,0,0.07)",cardBg:"#ffffff",cardBorder:"rgba(0,0,0,0.08)",rowBg:"#fafafa",rowBorder:"rgba(0,0,0,0.06)",btnBg:"linear-gradient(135deg,#facc15,#eab308)",btnShadow:"0 4px 18px rgba(234,179,8,0.38)",activeNav:"#111111",activeNavShadow:"none",textDark:"#111111",textMid:"#333333",textSoft:"#555555",textMuted:"#888888",userBadgeBg:"#f4f4f4",userBadgeBorder:"rgba(0,0,0,0.08)",avatarBg:"#111111",impactBg:"#fefce8",impactBorder:"rgba(234,179,8,0.25)" };
const inputStyle:React.CSSProperties = { background:"rgba(254,252,232,0.7)",border:"1.5px solid rgba(234,179,8,0.28)",borderRadius:10,padding:"10px 14px",fontSize:14,color:"#422006",outline:"none",width:"100%",transition:"border 0.15s" };
const TYPES:RequestType[]=["food","clothing","medical","volunteers","infrastructure","education"];
const URGENCIES:RequestUrgency[]=["critical","high","medium","low"];
const TYPE_ICONS:Record<string,string>={food:"🌾",clothing:"👕",medical:"💊",volunteers:"🤝",infrastructure:"🏗️",education:"📚"};
const URGENCY_COLORS:Record<string,{bg:string,text:string}>={critical:{bg:"#fef2f2",text:"#991b1b"},high:{bg:"#fff7ed",text:"#9a3412"},medium:{bg:"#fef9c3",text:"#713f12"},low:{bg:"#f0fdf4",text:"#166534"}};
function AnimatedNumber({value}:{value:number}){const[d,setD]=useState(0);useEffect(()=>{if(!value)return;let s=0;const step=value/(700/16);const t=setInterval(()=>{s+=step;if(s>=value){setD(value);clearInterval(t);}else setD(Math.floor(s));},16);return()=>clearInterval(t);},[value]);return <>{d}</>;}

export default function VillageDashboard(){
  const{data:requests,isLoading}=useMyVillageRequests();const{data:stats}=useVillageStats();const createRequest=useCreateVillageRequest();const{user,clearAuth}=useAuthStore();const router=useRouter();
  const[activeTab,setActiveTab]=useState<"overview"|"requests"|"new">("overview");
  const[form,setForm]=useState({requestType:"food" as RequestType,urgency:"high" as RequestUrgency,quantity:"",familiesAffected:"",requiredBy:"",details:""});
  const[formSuccess,setFormSuccess]=useState(false);
  const handleCreate=async(e:React.FormEvent)=>{e.preventDefault();await createRequest.mutateAsync({...form,quantity:parseInt(form.quantity),familiesAffected:parseInt(form.familiesAffected)});setFormSuccess(true);setForm({requestType:"food",urgency:"high",quantity:"",familiesAffected:"",requiredBy:"",details:""});setTimeout(()=>{setFormSuccess(false);setActiveTab("requests");},1800);};

  const Sidebar=()=>(
    <aside style={{position:"fixed",left:0,top:0,height:"100%",width:232,zIndex:20,background:C.sidebarBg,backdropFilter:"blur(18px)",borderRight:`1px solid ${C.sidebarBorder}`,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.sidebarBorder}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div className="animate-glow-pulse" style={{width:32,height:32,borderRadius:8,background:C.avatarBg,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#facc15",fontSize:13,fontWeight:700}}>N</span></div>
          <span style={{fontFamily:"Georgia,serif",fontSize:20,color:C.textDark,fontWeight:500}}>NeevUday</span>
        </div>
      </div>
      <div style={{padding:"12px 12px 0"}}>
        <div className="animate-slide-up" style={{padding:"10px 12px",borderRadius:12,background:C.userBadgeBg,border:`1px solid ${C.userBadgeBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:C.avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#facc15",flexShrink:0}}>{(user?.name?.[0]??"V").toUpperCase()}</div>
            <div style={{minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.textDark,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name??"Village"}</p><p style={{fontSize:11,color:C.textSoft,margin:0}}>Village representative</p></div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4}}>
        {([{id:"overview",label:"Overview",icon:"◈"},{id:"requests",label:"My Requests",icon:"📋"},{id:"new",label:"New Request",icon:"＋"}] as const).map((item,i)=>(
          <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`animate-slide-up stagger-${i+2}`}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",transition:"all 0.18s",background:activeTab===item.id?C.activeNav:"transparent",boxShadow:activeTab===item.id?C.activeNavShadow:"none",color:activeTab===item.id?"#ffffff":C.textMid}}>
            <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{margin:"0 12px 12px",padding:"12px",borderRadius:10,background:C.impactBg,border:`1px dashed ${C.impactBorder}`}}>
        <p style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Village status</p>
        <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
          {[{val:stats?.totalRequests??0,label:"Requests"},{val:stats?.matched??0,label:"Matched"},{val:stats?.delivered??0,label:"Delivered"}].map((s,i)=>(
            <div key={i}><p style={{fontSize:17,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0}}>{s.val}</p><p style={{fontSize:10,color:C.textMuted,margin:0}}>{s.label}</p></div>
          ))}
        </div>
      </div>
      <button onClick={()=>{clearAuth();router.push("/auth/login");}} style={{margin:"0 12px 16px",padding:"7px 12px",borderRadius:8,background:"transparent",border:"none",cursor:"pointer",fontSize:12,color:C.textMuted,display:"flex",alignItems:"center",gap:6}}>↩ Log out</button>
    </aside>
  );

  return (
    <div style={{minHeight:"100vh",background:C.pageBg}}>
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div className="animate-float" style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#facc15,#eab308,transparent 70%)",opacity:0.15}}/>
        <div className="animate-float" style={{position:"absolute",bottom:60,left:-60,width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,#fde047,transparent 70%)",opacity:0.1,animationDelay:"1.5s"}}/>
      </div>
      <Sidebar/>
      <main style={{marginLeft:232,minHeight:"100vh",padding:"36px 32px",position:"relative",zIndex:10}}>

        {activeTab==="overview"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:28}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Village Dashboard</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:500,color:C.textDark,lineHeight:1.2,margin:0}}>Welcome, <span className="shimmer-text">{user?.name?.split(" ")[0]??"Representative"}.</span></h1>
              <p style={{color:C.textSoft,marginTop:6,fontSize:13}}>Track aid requests and incoming deliveries for your community.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
              {[{label:"Total requests",value:stats?.totalRequests??0,icon:"📋"},{label:"Matched",value:stats?.matched??0,icon:"🔗"},{label:"In transit",value:stats?.inTransit??0,icon:"🚚"},{label:"Delivered",value:stats?.delivered??0,icon:"✅"}].map((m,idx)=>(
                <div key={m.label} className={`animate-slide-up stagger-${idx+1} donor-card-hover`} style={{borderRadius:16,padding:"18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,width:72,height:72,borderRadius:"50%",background:"radial-gradient(circle,#fde047,transparent 70%)",opacity:0.3}}/>
                  <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
                  <p style={{fontSize:30,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0}}><AnimatedNumber value={m.value}/></p>
                  <p style={{fontSize:11,color:C.textMuted,marginTop:4}}>{m.label}</p>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <div className="animate-slide-up stagger-3" style={{borderRadius:16,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:0}}>Recent requests</h2>
                  <button onClick={()=>setActiveTab("requests")} style={{fontSize:11,color:C.textSoft,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>View all →</button>
                </div>
                {isLoading?<div style={{height:80,borderRadius:10,background:"#fef9c3",opacity:0.5}}/>:!requests?.length?(
                  <div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:32,marginBottom:8}}>📋</div><p style={{color:C.textMuted,fontSize:13}}>No requests yet.</p><button onClick={()=>setActiveTab("new")} style={{marginTop:6,fontSize:12,color:C.textSoft,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Raise one →</button></div>
                ):requests.slice(0,4).map((r:any,i:number)=>{const uc=URGENCY_COLORS[r.urgency]??URGENCY_COLORS.medium;return(
                  <div key={r.id} className="animate-fade-in" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:10,background:C.rowBg,border:`1px solid ${C.rowBorder}`,marginBottom:6,animationDelay:`${i*0.07}s`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:30,height:30,borderRadius:8,background:"#fef9c3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{TYPE_ICONS[r.requestType]??"📦"}</div>
                      <div><p style={{fontSize:13,fontWeight:500,color:C.textDark,margin:0,textTransform:"capitalize"}}>{r.requestType} — {r.quantity} units</p><p style={{fontSize:11,color:C.textMuted,margin:0}}>{r.familiesAffected} families</p></div>
                    </div>
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:uc.bg,color:uc.text,fontWeight:500}}>{r.urgency}</span>
                  </div>
                );})}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="animate-slide-up stagger-4" style={{borderRadius:16,padding:"20px",background:"#fffbeb",border:"1px solid #fde68a",flex:1}}>
                  <div style={{fontSize:28,marginBottom:10,opacity:0.4,color:C.textMuted,fontFamily:"Georgia,serif"}}>"</div>
                  <p style={{fontSize:13,color:C.textMid,lineHeight:1.7,fontFamily:"Georgia,serif",fontStyle:"italic",margin:"0 0 10px"}}>"A community is only as strong as its weakest member. Together, we rise."</p>
                  <p style={{fontSize:10,color:C.textMuted,margin:0}}>— NeevUday mission</p>
                </div>
                <div className="animate-slide-up stagger-5" style={{borderRadius:12,padding:"16px",background:"#fef9c3",border:"1px dashed #fde047"}}>
                  <div style={{display:"flex",gap:10}}><span style={{fontSize:18,flexShrink:0}}>⚡</span><div><p style={{fontSize:11,fontWeight:600,color:C.textDark,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Priority tip</p><p style={{fontSize:12,color:C.textMid,margin:0,lineHeight:1.6}}>Mark requests as <strong>critical</strong> if your community needs aid within 48 hours.</p></div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==="requests"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Village</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>All requests</h1>
            </div>
            {!requests?.length?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:40,marginBottom:10}}>📋</div><p style={{color:C.textMuted}}>No requests yet.</p></div>:(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {requests.map((r:any,i:number)=>{const uc=URGENCY_COLORS[r.urgency]??URGENCY_COLORS.medium;return(
                  <div key={r.id} className={`animate-slide-up stagger-${(i%4)+1} donor-card-hover`} style={{borderRadius:14,padding:"16px 18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:36,height:36,borderRadius:10,background:"#fef9c3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{TYPE_ICONS[r.requestType]??"📦"}</div>
                      <div><p style={{fontSize:14,fontWeight:500,color:C.textDark,margin:0,textTransform:"capitalize"}}>{r.requestType} — {r.quantity} units</p><p style={{fontSize:11,color:C.textMuted,margin:"2px 0 0"}}>{r.familiesAffected} families · Due {new Date(r.requiredBy).toLocaleDateString("en-IN")}</p></div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:uc.bg,color:uc.text,fontWeight:500}}>{r.urgency}</span>
                      <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:C.rowBg,color:C.textMid,border:`1px solid ${C.rowBorder}`,textTransform:"capitalize"}}>{r.status}</span>
                    </div>
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {activeTab==="new"&&(
          <div style={{maxWidth:580}}>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Village</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>New community request</h1>
            </div>
            {formSuccess&&<div className="animate-slide-up" style={{marginBottom:16,padding:"14px",borderRadius:12,background:"#f0fdf4",border:"1px solid #86efac",display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>🎉</span><p style={{fontSize:13,fontWeight:600,color:"#166534",margin:0}}>Request submitted!</p></div>}
            <div className="animate-slide-up stagger-1" style={{borderRadius:16,padding:"26px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
              <form onSubmit={handleCreate} style={{display:"flex",flexDirection:"column",gap:18}}>
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Request type</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
                    {TYPES.map(t=><button type="button" key={t} onClick={()=>setForm(f=>({...f,requestType:t}))}
                      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 4px",borderRadius:10,border:"none",cursor:"pointer",fontSize:11,fontWeight:500,transition:"all 0.18s",background:form.requestType===t?"linear-gradient(135deg,#facc15,#eab308)":"rgba(254,252,232,0.7)",boxShadow:form.requestType===t?"0 4px 12px rgba(234,179,8,0.35)":"none",color:C.textDark,outline:form.requestType!==t?"1px solid rgba(234,179,8,0.2)":"none",transform:form.requestType===t?"scale(1.04)":"scale(1)"}}>
                      <span style={{fontSize:18}}>{TYPE_ICONS[t]}</span><span style={{textTransform:"capitalize"}}>{t}</span>
                    </button>)}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Urgency</label>
                    <select style={{...inputStyle,appearance:"none"}} value={form.urgency} onFocus={e=>(e.target as any).style.border="1.5px solid #eab308"} onBlur={e=>(e.target as any).style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,urgency:e.target.value as RequestUrgency}))}>
                      {URGENCIES.map(u=><option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Quantity needed</label>
                    <input type="number" min="1" style={inputStyle} placeholder="e.g. 200" value={form.quantity} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} required/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Families affected</label>
                    <input type="number" min="1" style={inputStyle} placeholder="e.g. 50" value={form.familiesAffected} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,familiesAffected:e.target.value}))} required/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Required by</label>
                    <input type="date" style={inputStyle} value={form.requiredBy} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,requiredBy:e.target.value}))} required/>
                  </div>
                </div>
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Details</label>
                  <textarea rows={3} style={{...inputStyle,resize:"none"}} placeholder="Describe the situation…" value={form.details} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,details:e.target.value}))}/>
                </div>
                <button type="submit" disabled={createRequest.isPending} style={{padding:"13px",borderRadius:10,border:"none",background:C.btnBg,boxShadow:C.btnShadow,fontSize:14,fontWeight:600,color:C.textDark,cursor:"pointer"}}>{createRequest.isPending?"Submitting…":"Submit request →"}</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
