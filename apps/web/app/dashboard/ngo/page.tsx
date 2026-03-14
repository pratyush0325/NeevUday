"use client";
import { useState, useEffect } from "react";
import { useNgoProfile, useNgoStats, useCreateProject } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import "../../donor-animations.css";

const C = { pageBg:"#ffffff",sidebarBg:"#fafafa",sidebarBorder:"rgba(0,0,0,0.07)",cardBg:"#ffffff",cardBorder:"rgba(0,0,0,0.08)",rowBg:"#fafafa",rowBorder:"rgba(0,0,0,0.06)",btnBg:"linear-gradient(135deg,#facc15,#eab308)",btnShadow:"0 4px 18px rgba(234,179,8,0.38)",activeNav:"#111111",activeNavShadow:"none",textDark:"#111111",textMid:"#333333",textSoft:"#555555",textMuted:"#888888",userBadgeBg:"#f4f4f4",userBadgeBorder:"rgba(0,0,0,0.08)",avatarBg:"#111111",impactBg:"#fefce8",impactBorder:"rgba(234,179,8,0.25)" };
const inputStyle:React.CSSProperties = { background:"rgba(254,252,232,0.7)",border:"1.5px solid rgba(234,179,8,0.28)",borderRadius:10,padding:"10px 14px",fontSize:14,color:"#422006",outline:"none",width:"100%",transition:"border 0.15s" };
function AnimatedNumber({value}:{value:number}){const[d,setD]=useState(0);useEffect(()=>{if(!value)return;let s=0;const step=value/(700/16);const t=setInterval(()=>{s+=step;if(s>=value){setD(value);clearInterval(t);}else setD(Math.floor(s));},16);return()=>clearInterval(t);},[value]);return <>{d}</>;}

export default function NgoDashboard(){
  const{data:profile,isLoading}=useNgoProfile();const{data:stats}=useNgoStats();const createProject=useCreateProject();const{user,clearAuth}=useAuthStore();const router=useRouter();
  const[activeTab,setActiveTab]=useState<"overview"|"projects"|"new">("overview");
  const[form,setForm]=useState({title:"",description:"",location:"",workersNeeded:""});
  const[formSuccess,setFormSuccess]=useState(false);
  const projects=(profile?.projects??[]) as any[];
  const active=projects.filter((p:any)=>p.status==="active");
  const handleCreate=async(e:React.FormEvent)=>{e.preventDefault();await createProject.mutateAsync({...form,workersNeeded:parseInt(form.workersNeeded)});setFormSuccess(true);setForm({title:"",description:"",location:"",workersNeeded:""});setTimeout(()=>{setFormSuccess(false);setActiveTab("projects");},1800);};

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
            <div style={{width:34,height:34,borderRadius:"50%",background:C.avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#facc15",flexShrink:0}}>{(user?.name?.[0]??"N").toUpperCase()}</div>
            <div style={{minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.textDark,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name??"NGO"}</p><p style={{fontSize:11,color:C.textSoft,margin:0}}>NGO partner</p></div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4}}>
        {([{id:"overview",label:"Overview",icon:"◈"},{id:"projects",label:"Projects",icon:"📋"},{id:"new",label:"New Project",icon:"＋"}] as const).map((item,i)=>(
          <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`animate-slide-up stagger-${i+2}`}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",transition:"all 0.18s",background:activeTab===item.id?C.activeNav:"transparent",boxShadow:activeTab===item.id?C.activeNavShadow:"none",color:activeTab===item.id?"#ffffff":C.textMid}}>
            <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{margin:"0 12px 12px",padding:"12px",borderRadius:10,background:C.impactBg,border:`1px dashed ${C.impactBorder}`}}>
        <p style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Organisation</p>
        <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
          {[{val:stats?.activeProjects??0,label:"Projects"},{val:stats?.workersAssigned??0,label:"Workers"},{val:active.length,label:"Active"}].map((s,i)=>(
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
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>NGO Dashboard</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:500,color:C.textDark,lineHeight:1.2,margin:0}}>Welcome, <span className="shimmer-text">{profile?.name??user?.name??"Partner"}.</span></h1>
              <p style={{color:C.textSoft,marginTop:6,fontSize:13}}>Manage your projects, workers, and incoming supplies.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
              {[{label:"Active projects",value:stats?.activeProjects??0,icon:"📋"},{label:"Workers assigned",value:stats?.workersAssigned??0,icon:"👷"},{label:"Supplies received",value:stats?.suppliesReceived??0,icon:"📦"},{label:"Total projects",value:projects.length,icon:"🗂️"}].map((m,idx)=>(
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
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:0}}>Active projects</h2>
                  <button onClick={()=>setActiveTab("new")} style={{fontSize:11,color:C.textSoft,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>+ New →</button>
                </div>
                {isLoading?<div style={{height:80,borderRadius:10,background:"#fef9c3",opacity:0.5}}/>:!active.length?(
                  <div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:32,marginBottom:8}}>📋</div><p style={{color:C.textMuted,fontSize:13}}>No active projects yet.</p></div>
                ):active.map((p:any,i:number)=>(
                  <div key={p.id} className="animate-fade-in" style={{marginBottom:14,animationDelay:`${i*0.07}s`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><p style={{fontSize:13,fontWeight:500,color:C.textDark,margin:0}}>{p.title}</p><span style={{fontSize:11,color:C.textMuted}}>{p.progressPercent}%</span></div>
                    <p style={{fontSize:11,color:C.textMuted,margin:"0 0 6px"}}>📍 {p.location}</p>
                    <div style={{height:6,borderRadius:99,background:"#fef3c7",overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:`${p.progressPercent}%`,background:"linear-gradient(90deg,#facc15,#eab308)",transition:"width 0.6s ease"}}/></div>
                    <p style={{fontSize:10,color:C.textMuted,marginTop:4}}>{p.workersNeeded} workers needed</p>
                  </div>
                ))}
              </div>
              <div className="animate-slide-up stagger-4" style={{borderRadius:16,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:"0 0 16px"}}>Organisation details</h2>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[{label:"Name",value:profile?.name??"—"},{label:"State",value:profile?.state??"—"},{label:"Status",value:profile?.verificationStatus??"pending"}].map(row=>(
                    <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderRadius:8,background:C.rowBg,border:`1px solid ${C.rowBorder}`}}>
                      <span style={{fontSize:12,color:C.textMuted}}>{row.label}</span>
                      <span style={{fontSize:12,fontWeight:500,color:C.textDark,textTransform:"capitalize"}}>{row.value}</span>
                    </div>
                  ))}
                  {profile?.focusAreas?.length&&(
                    <div style={{padding:"10px 12px",borderRadius:8,background:C.rowBg,border:`1px solid ${C.rowBorder}`}}>
                      <span style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:6}}>Focus areas</span>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {profile.focusAreas.map((a:string)=><span key={a} style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:"#fef9c3",color:C.textMid,border:"1px solid #fde068"}}>{a}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{marginTop:16,padding:"14px",borderRadius:12,background:"#fef9c3",border:"1px dashed #fde047"}}>
                  <p style={{fontSize:12,fontStyle:"italic",color:C.textMid,fontFamily:"Georgia,serif",margin:"0 0 6px"}}>"The best way to find yourself is to lose yourself in the service of others."</p>
                  <p style={{fontSize:10,color:C.textMuted,margin:0}}>— Mahatma Gandhi</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==="projects"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>NGO</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>All projects</h1>
            </div>
            {!projects.length?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:40,marginBottom:10}}>📋</div><p style={{color:C.textMuted}}>No projects yet.</p></div>:(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {projects.map((p:any,i:number)=>(
                  <div key={p.id} className={`animate-slide-up stagger-${(i%4)+1} donor-card-hover`} style={{borderRadius:16,padding:"18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <p style={{fontSize:14,fontWeight:500,color:C.textDark,margin:0}}>{p.title}</p>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:p.status==="active"?"#fef9c3":"#f0fdf4",color:p.status==="active"?C.textMid:"#166534",border:`1px solid ${p.status==="active"?"#fde068":"#86efac"}`}}>{p.status}</span>
                    </div>
                    <p style={{fontSize:11,color:C.textMuted,margin:"0 0 10px"}}>📍 {p.location}</p>
                    <div style={{height:6,borderRadius:99,background:"#fef3c7",overflow:"hidden",marginBottom:6}}><div style={{height:"100%",borderRadius:99,width:`${p.progressPercent}%`,background:"linear-gradient(90deg,#facc15,#eab308)"}}/></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:C.textMuted}}>{p.progressPercent}% complete</span><span style={{fontSize:10,color:C.textMuted}}>{p.workersNeeded} workers needed</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==="new"&&(
          <div style={{maxWidth:560}}>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Create</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>New project</h1>
            </div>
            {formSuccess&&<div className="animate-slide-up" style={{marginBottom:16,padding:"14px",borderRadius:12,background:"#f0fdf4",border:"1px solid #86efac",display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:20}}>🎉</span><p style={{fontSize:13,fontWeight:600,color:"#166534",margin:0}}>Project created!</p></div>}
            <div className="animate-slide-up stagger-1" style={{borderRadius:16,padding:"26px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
              <form onSubmit={handleCreate} style={{display:"flex",flexDirection:"column",gap:18}}>
                {[{label:"Project title",key:"title",placeholder:"Winter blanket drive — Chamba"},{label:"Location",key:"location",placeholder:"Chamba, Himachal Pradesh"}].map(f=>(
                  <div key={f.key}>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</label>
                    <input style={inputStyle} placeholder={f.placeholder} value={(form as any)[f.key]} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))} required/>
                  </div>
                ))}
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Workers needed</label>
                  <input type="number" min="1" style={inputStyle} placeholder="10" value={form.workersNeeded} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,workersNeeded:e.target.value}))} required/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSoft,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Description</label>
                  <textarea rows={3} style={{...inputStyle,resize:"none"}} placeholder="Describe the project goal…" value={form.description} onFocus={e=>e.target.style.border="1.5px solid #eab308"} onBlur={e=>e.target.style.border="1.5px solid rgba(234,179,8,0.28)"} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
                </div>
                <button type="submit" disabled={createProject.isPending} style={{padding:"13px",borderRadius:10,border:"none",background:C.btnBg,boxShadow:C.btnShadow,fontSize:14,fontWeight:600,color:C.textDark,cursor:"pointer"}}>{createProject.isPending?"Creating…":"Create project →"}</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
