"use client";
import { useState, useEffect } from "react";
import { useWorkerProfile, useActiveAssignment } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import "../../donor-animations.css";

const C = { pageBg:"#ffffff",sidebarBg:"#fafafa",sidebarBorder:"rgba(0,0,0,0.07)",cardBg:"#ffffff",cardBorder:"rgba(0,0,0,0.08)",rowBg:"#fafafa",rowBorder:"rgba(0,0,0,0.06)",btnBg:"linear-gradient(135deg,#facc15,#eab308)",btnShadow:"0 4px 18px rgba(234,179,8,0.38)",activeNav:"#111111",activeNavShadow:"none",textDark:"#111111",textMid:"#333333",textSoft:"#555555",textMuted:"#888888",userBadgeBg:"#f4f4f4",userBadgeBorder:"rgba(0,0,0,0.08)",avatarBg:"#111111",impactBg:"#fefce8",impactBorder:"rgba(234,179,8,0.25)" };
function AnimatedNumber({value}:{value:number}){const[d,setD]=useState(0);useEffect(()=>{if(!value)return;let s=0;const step=value/(700/16);const t=setInterval(()=>{s+=step;if(s>=value){setD(value);clearInterval(t);}else setD(Math.floor(s));},16);return()=>clearInterval(t);},[value]);return <>{d}</>;}

export default function WorkerDashboard(){
  const{data:profile,isLoading}=useWorkerProfile();const{data:assignment}=useActiveAssignment();const{user,clearAuth}=useAuthStore();const router=useRouter();
  const[activeTab,setActiveTab]=useState<"overview"|"assignment"|"profile">("overview");

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
            <div style={{width:34,height:34,borderRadius:"50%",background:C.avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#facc15",flexShrink:0}}>{(user?.name?.[0]??"W").toUpperCase()}</div>
            <div style={{minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.textDark,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name??"Worker"}</p><p style={{fontSize:11,color:C.textSoft,margin:0}}>Field worker</p></div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4}}>
        {([{id:"overview",label:"Overview",icon:"◈"},{id:"assignment",label:"My Assignment",icon:"📍"},{id:"profile",label:"My Profile",icon:"👤"}] as const).map((item,i)=>(
          <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`animate-slide-up stagger-${i+2}`}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",transition:"all 0.18s",background:activeTab===item.id?C.activeNav:"transparent",boxShadow:activeTab===item.id?C.activeNavShadow:"none",color:activeTab===item.id?"#ffffff":C.textMid}}>
            <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{margin:"0 12px 12px",padding:"12px",borderRadius:10,background:C.impactBg,border:`1px dashed ${C.impactBorder}`}}>
        <p style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>My stats</p>
        <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
          {[{val:profile?.daysWorked??0,label:"Days"},{val:profile?.rating?.toFixed(1)??"—",label:"Rating"},{val:profile?.skills?.length??0,label:"Skills"}].map((s,i)=>(
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
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Worker Dashboard</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:500,color:C.textDark,lineHeight:1.2,margin:0}}>Welcome back, <span className="shimmer-text">{user?.name?.split(" ")[0]??"friend"}.</span></h1>
              <p style={{color:C.textSoft,marginTop:6,fontSize:13}}>Your work is making a real difference on the ground.</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
              {[{label:"Days worked",value:profile?.daysWorked??0,icon:"📅"},{label:"Rating",value:null,raw:profile?.rating?.toFixed(1)??"—",icon:"⭐"},{label:"Skills",value:profile?.skills?.length??0,icon:"🛠️"},{label:"Status",value:null,raw:profile?.status??"available",icon:"🟢"}].map((m,idx)=>(
                <div key={m.label} className={`animate-slide-up stagger-${idx+1} donor-card-hover`} style={{borderRadius:16,padding:"18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,width:72,height:72,borderRadius:"50%",background:"radial-gradient(circle,#fde047,transparent 70%)",opacity:0.3}}/>
                  <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
                  {m.value!==null?<p style={{fontSize:30,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0}}><AnimatedNumber value={m.value}/></p>:<p style={{fontSize:18,fontWeight:600,color:C.textDark,margin:0,textTransform:"capitalize"}}>{m.raw}</p>}
                  <p style={{fontSize:11,color:C.textMuted,marginTop:4}}>{m.label}</p>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              {/* Active assignment */}
              <div className="animate-slide-up stagger-3" style={{borderRadius:16,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:0}}>Current assignment</h2>
                  <span style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#16a34a",fontWeight:600,background:"#f0fdf4",border:"1px solid #86efac",padding:"3px 8px",borderRadius:99}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/>Active
                  </span>
                </div>
                {!assignment?(
                  <div style={{textAlign:"center",padding:"28px 0"}}>
                    <div style={{fontSize:32,marginBottom:8}}>📭</div>
                    <p style={{color:C.textMuted,fontSize:13}}>No active assignment yet.</p>
                    <p style={{color:C.textSoft,fontSize:11,marginTop:4}}>The platform will assign you soon.</p>
                  </div>
                ):(
                  <div>
                    <p style={{fontSize:14,fontWeight:500,color:C.textDark,margin:"0 0 4px"}}>{(assignment as any).project?.title}</p>
                    <p style={{fontSize:12,color:C.textMuted,margin:"0 0 14px"}}>{(assignment as any).taskDescription}</p>
                    <div style={{height:8,borderRadius:99,background:"#fef3c7",overflow:"hidden",marginBottom:8}}><div style={{height:"100%",borderRadius:99,width:`${(assignment as any).progressPercent??0}%`,background:"linear-gradient(90deg,#facc15,#eab308)",transition:"width 0.6s ease"}}/></div>
                    <p style={{fontSize:11,color:C.textMuted}}>{(assignment as any).progressPercent??0}% complete</p>
                  </div>
                )}
              </div>

              {/* Skills + tips */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="animate-slide-up stagger-4" style={{borderRadius:16,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,flex:1}}>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:"0 0 12px"}}>My skills</h2>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {profile?.skills?.length?profile.skills.map((s:string)=>(
                      <span key={s} style={{fontSize:12,padding:"4px 12px",borderRadius:99,background:"#fef9c3",color:C.textMid,border:"1px solid #fde068"}}>{s}</span>
                    )):<p style={{color:C.textMuted,fontSize:12}}>No skills listed.</p>}
                  </div>
                  {profile?.location&&<p style={{fontSize:12,color:C.textMuted,marginTop:12}}>📍 {profile.location}</p>}
                  {profile?.preferredWork&&<p style={{fontSize:12,color:C.textMuted,marginTop:4}}>🛠️ Prefers: {profile.preferredWork}</p>}
                </div>
                <div className="animate-slide-up stagger-5" style={{borderRadius:12,padding:"14px 16px",background:"#fef9c3",border:"1px dashed #fde047"}}>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:18,flexShrink:0}}>💡</span>
                    <div>
                      <p style={{fontSize:11,fontWeight:600,color:C.textDark,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Tip</p>
                      <p style={{fontSize:12,color:C.textMid,margin:0,lineHeight:1.6}}>Workers with higher ratings get priority for new assignments from NGOs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==="assignment"&&(
          <div style={{maxWidth:600}}>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Worker</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>Current assignment</h1>
            </div>
            {!assignment?(
              <div className="animate-slide-up stagger-1" style={{borderRadius:16,padding:"48px",textAlign:"center",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <div style={{fontSize:48,marginBottom:12}}>📭</div>
                <p style={{fontFamily:"Georgia,serif",fontSize:18,color:C.textDark,margin:"0 0 6px"}}>No active assignment</p>
                <p style={{fontSize:13,color:C.textMuted}}>The platform admin will assign you to a project soon. Stay ready!</p>
              </div>
            ):(
              <div className="animate-slide-up stagger-1" style={{borderRadius:16,padding:"24px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <p style={{fontSize:16,fontWeight:500,color:C.textDark,margin:"0 0 6px"}}>{(assignment as any).project?.title}</p>
                <p style={{fontSize:13,color:C.textMuted,margin:"0 0 20px"}}>{(assignment as any).taskDescription}</p>
                <div style={{height:10,borderRadius:99,background:"#fef3c7",overflow:"hidden",marginBottom:8}}><div style={{height:"100%",borderRadius:99,width:`${(assignment as any).progressPercent??0}%`,background:"linear-gradient(90deg,#facc15,#eab308)",transition:"width 0.8s ease"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:C.textMuted}}>{(assignment as any).progressPercent??0}% complete</span>
                  <span style={{fontSize:12,color:C.textMid,fontWeight:500}}>In progress</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab==="profile"&&(
          <div style={{maxWidth:500}}>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Worker</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>My profile</h1>
            </div>
            <div className="animate-slide-up stagger-1" style={{borderRadius:16,padding:"24px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
              {isLoading?<div style={{height:200,borderRadius:10,background:"#fef9c3",opacity:0.5}}/>:(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[{label:"Location",value:profile?.location??"—"},{label:"Preferred work",value:profile?.preferredWork??"—"},{label:"Rating",value:profile?.rating?.toFixed(1)??"—"},{label:"Days worked",value:String(profile?.daysWorked??0)},{label:"Status",value:profile?.status??"available"}].map(row=>(
                    <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:10,background:C.rowBg,border:`1px solid ${C.rowBorder}`}}>
                      <span style={{fontSize:12,color:C.textMuted}}>{row.label}</span>
                      <span style={{fontSize:13,fontWeight:500,color:C.textDark,textTransform:"capitalize"}}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{padding:"10px 14px",borderRadius:10,background:C.rowBg,border:`1px solid ${C.rowBorder}`}}>
                    <span style={{fontSize:12,color:C.textMuted,display:"block",marginBottom:8}}>Skills</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {profile?.skills?.map((s:string)=><span key={s} style={{fontSize:12,padding:"3px 10px",borderRadius:99,background:"#fef9c3",color:C.textMid,border:"1px solid #fde068"}}>{s}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
