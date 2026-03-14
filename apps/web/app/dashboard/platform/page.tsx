"use client";
import { useState, useEffect } from "react";
import { usePlatformStats, useAllDonations, useAllNgos, useAvailableWorkers, useMatchSuggestions, useMatchDonation, useUpdateNgoVerification } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import "../../donor-animations.css";

const C = { pageBg:"#ffffff",sidebarBg:"#fafafa",sidebarBorder:"rgba(0,0,0,0.07)",cardBg:"#ffffff",cardBorder:"rgba(0,0,0,0.08)",rowBg:"#fafafa",rowBorder:"rgba(0,0,0,0.06)",btnBg:"linear-gradient(135deg,#facc15,#eab308)",btnShadow:"0 4px 18px rgba(234,179,8,0.38)",activeNav:"#111111",activeNavShadow:"none",textDark:"#111111",textMid:"#333333",textSoft:"#555555",textMuted:"#888888",userBadgeBg:"#f4f4f4",userBadgeBorder:"rgba(0,0,0,0.08)",avatarBg:"#111111",impactBg:"#fefce8",impactBorder:"rgba(234,179,8,0.25)" };
function AnimatedNumber({value}:{value:number}){const[d,setD]=useState(0);useEffect(()=>{if(!value)return;let s=0;const step=value/(700/16);const t=setInterval(()=>{s+=step;if(s>=value){setD(value);clearInterval(t);}else setD(Math.floor(s));},16);return()=>clearInterval(t);},[value]);return <>{d}</>;}

export default function PlatformDashboard(){
  const{data:stats}=usePlatformStats();const{data:donations,isLoading:dLoad}=useAllDonations();const{data:ngos,isLoading:nLoad}=useAllNgos();const{data:suggestions}=useMatchSuggestions();const{data:workers}=useAvailableWorkers();
  const matchDonation=useMatchDonation();const verifyNgo=useUpdateNgoVerification();const{user,clearAuth}=useAuthStore();const router=useRouter();
  const[activeTab,setActiveTab]=useState<"overview"|"donations"|"ngos"|"matching"|"workers">("overview");

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
            <div style={{width:34,height:34,borderRadius:"50%",background:C.avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#facc15",flexShrink:0}}>{(user?.name?.[0]??"P").toUpperCase()}</div>
            <div style={{minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.textDark,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name??"Admin"}</p><p style={{fontSize:11,color:C.textSoft,margin:0}}>Platform admin</p></div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4}}>
        {([{id:"overview",label:"Overview",icon:"◈"},{id:"donations",label:"Donations",icon:"📦"},{id:"ngos",label:"NGOs",icon:"🏢"},{id:"matching",label:"Matching",icon:"🔗"},{id:"workers",label:"Workers",icon:"👷"}] as const).map((item,i)=>(
          <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`animate-slide-up stagger-${Math.min(i+2,6)}`}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",transition:"all 0.18s",background:activeTab===item.id?C.activeNav:"transparent",boxShadow:activeTab===item.id?C.activeNavShadow:"none",color:activeTab===item.id?"#ffffff":C.textMid}}>
            <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{margin:"0 12px 12px",padding:"12px",borderRadius:10,background:C.impactBg,border:`1px dashed ${C.impactBorder}`}}>
        <p style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Platform</p>
        <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
          {[{val:stats?.totalDonations??0,label:"Donations"},{val:stats?.totalNgos??0,label:"NGOs"},{val:stats?.totalVillages??0,label:"Villages"}].map((s,i)=>(
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
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Platform Admin</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:500,color:C.textDark,lineHeight:1.2,margin:0}}>Good morning, <span className="shimmer-text">{user?.name?.split(" ")[0]??"Admin"}.</span></h1>
              <p style={{color:C.textSoft,marginTop:6,fontSize:13}}>Here's the full picture of NeevUday's operations today.</p>
            </div>

            {/* Metrics */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
              {[{label:"Total donations",value:stats?.totalDonations??0,icon:"📦"},{label:"Active NGOs",value:stats?.totalNgos??0,icon:"🏢"},{label:"Villages served",value:stats?.totalVillages??0,icon:"🏘️"},{label:"Workers available",value:stats?.availableWorkers??0,icon:"👷"}].map((m,idx)=>(
                <div key={m.label} className={`animate-slide-up stagger-${idx+1} donor-card-hover`} style={{borderRadius:16,padding:"18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-20,right:-20,width:72,height:72,borderRadius:"50%",background:"radial-gradient(circle,#fde047,transparent 70%)",opacity:0.3}}/>
                  <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
                  <p style={{fontSize:30,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0}}><AnimatedNumber value={m.value}/></p>
                  <p style={{fontSize:11,color:C.textMuted,marginTop:4}}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Shimmer stats strip */}
            <div className="animate-slide-up stagger-3" style={{borderRadius:16,padding:"18px 28px",background:"linear-gradient(135deg,#fef9c3,#fef3c7)",border:"1px solid #fde68a",display:"flex",alignItems:"center",justifyContent:"space-around",position:"relative",overflow:"hidden",marginBottom:18}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(250,204,21,0.15) 50%,transparent 100%)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite",pointerEvents:"none"}}/>
              {[{val:`${stats?.matchRate??94}%`,label:"Match rate"},{val:stats?.pendingMatches??0,label:"Pending matches"},{val:stats?.inTransit??0,label:"In transit"},{val:stats?.delivered??0,label:"Delivered"},{val:stats?.pendingVerifications??0,label:"NGOs to verify"}].map((s,i)=>(
                <div key={i} className="animate-fade-in" style={{textAlign:"center",animationDelay:`${i*0.08}s`,zIndex:1}}>
                  <p style={{fontSize:22,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0}}>{s.val}</p>
                  <p style={{fontSize:10,color:C.textSoft,marginTop:3}}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              {/* Pending matches */}
              <div className="animate-slide-up stagger-4" style={{borderRadius:16,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:0}}>Pending matches</h2>
                  <button onClick={()=>setActiveTab("matching")} style={{fontSize:11,color:C.textSoft,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>View all →</button>
                </div>
                {!suggestions?.length?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:28,marginBottom:6}}>✅</div><p style={{color:C.textMuted,fontSize:12}}>All caught up!</p></div>:
                suggestions.slice(0,3).map((s:any,i:number)=>(
                  <div key={s.donationId} className="animate-fade-in" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:10,background:C.rowBg,border:`1px solid ${C.rowBorder}`,marginBottom:6,animationDelay:`${i*0.07}s`}}>
                    <div><p style={{fontSize:12,fontWeight:500,color:C.textDark,margin:0}}>{s.donationItem}</p><p style={{fontSize:11,color:C.textMuted,margin:0}}>→ {s.villageName}</p></div>
                    <button onClick={()=>matchDonation.mutate({donationId:s.donationId,villageRequestId:s.villageRequestId})} style={{fontSize:11,padding:"4px 10px",borderRadius:8,border:"none",background:C.btnBg,color:C.textDark,fontWeight:600,cursor:"pointer"}}>Match</button>
                  </div>
                ))}
              </div>

              {/* NGO verifications */}
              <div className="animate-slide-up stagger-5" style={{borderRadius:16,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:0}}>NGO verifications</h2>
                  <button onClick={()=>setActiveTab("ngos")} style={{fontSize:11,color:C.textSoft,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>View all →</button>
                </div>
                {nLoad?<div style={{height:60,borderRadius:10,background:"#fef9c3",opacity:0.5}}/>:
                ngos?.filter((n:any)=>n.verificationStatus==="pending"||n.verificationStatus==="under_review").slice(0,3).map((n:any,i:number)=>(
                  <div key={n.id} className="animate-fade-in" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:10,background:C.rowBg,border:`1px solid ${C.rowBorder}`,marginBottom:6,animationDelay:`${i*0.07}s`}}>
                    <div><p style={{fontSize:12,fontWeight:500,color:C.textDark,margin:0}}>{n.name}</p><p style={{fontSize:11,color:C.textMuted,margin:0}}>{n.state}</p></div>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>verifyNgo.mutate({ngoId:n.id,status:"approved"})} style={{fontSize:11,padding:"4px 8px",borderRadius:7,border:"none",background:"#f0fdf4",color:"#166534",fontWeight:600,cursor:"pointer"}}>✓</button>
                      <button onClick={()=>verifyNgo.mutate({ngoId:n.id,status:"rejected"})} style={{fontSize:11,padding:"4px 8px",borderRadius:7,border:"none",background:"#fef2f2",color:"#991b1b",fontWeight:600,cursor:"pointer"}}>✗</button>
                    </div>
                  </div>
                ))}
                {ngos?.filter((n:any)=>n.verificationStatus==="pending"||n.verificationStatus==="under_review").length===0&&<div style={{textAlign:"center",padding:"20px 0"}}><p style={{color:C.textMuted,fontSize:12}}>No pending verifications.</p></div>}
              </div>
            </div>
          </div>
        )}

        {activeTab==="donations"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Platform</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>All donations</h1>
            </div>
            <div className="animate-slide-up stagger-1" style={{borderRadius:16,overflow:"hidden",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"10px 18px",background:"rgba(254,252,232,0.8)",borderBottom:`1px solid ${C.cardBorder}`,fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                <div>Item</div><div>Category</div><div>Quantity</div><div>Donor</div><div>Status</div>
              </div>
              {dLoad?<div style={{padding:18,display:"flex",flexDirection:"column",gap:8}}>{[1,2,3,4].map(i=><div key={i} style={{height:44,borderRadius:10,background:"#fef9c3",opacity:0.5}}/>)}</div>:
              !donations?.length?<div style={{textAlign:"center",padding:"48px 0"}}><p style={{color:C.textMuted}}>No donations yet.</p></div>:
              donations.map((d:any,i:number)=>(
                <div key={d.id} className="donor-card-hover animate-fade-in" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 18px",alignItems:"center",animationDelay:`${i*0.04}s`,borderBottom:i<donations.length-1?`1px solid ${C.rowBorder}`:"none"}}>
                  <span style={{fontSize:13,fontWeight:500,color:C.textDark}}>{d.itemName}</span>
                  <span style={{fontSize:12,color:C.textMuted,textTransform:"capitalize"}}>{d.category}</span>
                  <span style={{fontSize:13,color:C.textMid}}>{d.quantity} {d.unit}</span>
                  <span style={{fontSize:12,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.donorName??"—"}</span>
                  <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:"#fef9c3",color:C.textMid,border:"1px solid #fde068",width:"fit-content",textTransform:"capitalize"}}>{d.status?.replace("_"," ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==="ngos"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Platform</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>NGO management</h1>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {nLoad?[1,2,3].map(i=><div key={i} style={{height:56,borderRadius:14,background:"#fef9c3",opacity:0.5}}/>):
              ngos?.map((n:any,i:number)=>(
                <div key={n.id} className={`animate-slide-up stagger-${(i%4)+1} donor-card-hover`} style={{borderRadius:14,padding:"14px 18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <div>
                    <p style={{fontSize:14,fontWeight:500,color:C.textDark,margin:0}}>{n.name}</p>
                    <p style={{fontSize:11,color:C.textMuted,margin:"2px 0 0"}}>📍 {n.state} · {n.focusAreas?.join(", ")}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:n.verificationStatus==="approved"?"#f0fdf4":"#fef9c3",color:n.verificationStatus==="approved"?"#166534":C.textMid,border:`1px solid ${n.verificationStatus==="approved"?"#86efac":"#fde068"}`,textTransform:"capitalize"}}>{n.verificationStatus}</span>
                    {(n.verificationStatus==="pending"||n.verificationStatus==="under_review")&&<>
                      <button onClick={()=>verifyNgo.mutate({ngoId:n.id,status:"approved"})} style={{fontSize:11,padding:"5px 10px",borderRadius:8,border:"none",background:"#f0fdf4",color:"#166534",fontWeight:600,cursor:"pointer"}}>Approve</button>
                      <button onClick={()=>verifyNgo.mutate({ngoId:n.id,status:"rejected"})} style={{fontSize:11,padding:"5px 10px",borderRadius:8,border:"none",background:"#fef2f2",color:"#991b1b",fontWeight:600,cursor:"pointer"}}>Reject</button>
                    </>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==="matching"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Platform</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>Match donations</h1>
            </div>
            {!suggestions?.length?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:40,marginBottom:10}}>✅</div><p style={{color:C.textMuted}}>All donations matched!</p></div>:(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {suggestions.map((s:any,i:number)=>(
                  <div key={s.donationId} className={`animate-slide-up stagger-${(i%4)+1} donor-card-hover`} style={{borderRadius:14,padding:"16px 18px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                    <div>
                      <p style={{fontSize:14,fontWeight:500,color:C.textDark,margin:0}}>{s.donationItem} <span style={{fontSize:11,color:C.textMuted,fontWeight:400}}>({s.donationQuantity} units)</span></p>
                      <p style={{fontSize:12,color:C.textSoft,margin:"3px 0 0"}}>→ {s.villageName}, {s.villageState}</p>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,padding:"3px 9px",borderRadius:99,background:s.urgency==="critical"?"#fef2f2":"#fef9c3",color:s.urgency==="critical"?"#991b1b":C.textMid,border:`1px solid ${s.urgency==="critical"?"#fecaca":"#fde068"}`}}>{s.urgency}</span>
                      <button onClick={()=>matchDonation.mutate({donationId:s.donationId,villageRequestId:s.villageRequestId})} disabled={matchDonation.isPending} style={{fontSize:12,padding:"7px 14px",borderRadius:9,border:"none",background:C.btnBg,boxShadow:C.btnShadow,color:C.textDark,fontWeight:600,cursor:"pointer"}}>Confirm match →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab==="workers"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Platform</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:500,color:C.textDark,margin:0}}>Available workers</h1>
            </div>
            {!workers?.length?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:40,marginBottom:10}}>👷</div><p style={{color:C.textMuted}}>No available workers.</p></div>:(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {workers.map((w:any,i:number)=>(
                  <div key={w.id} className={`animate-slide-up stagger-${(i%4)+1} donor-card-hover`} style={{borderRadius:14,padding:"16px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:C.avatarBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.textDark,flexShrink:0}}>{(w.name?.[0]??"W").toUpperCase()}</div>
                      <div><p style={{fontSize:13,fontWeight:500,color:C.textDark,margin:0}}>{w.name}</p><p style={{fontSize:11,color:C.textMuted,margin:0}}>📍 {w.location}</p></div>
                      <span style={{marginLeft:"auto",fontSize:11,padding:"3px 8px",borderRadius:99,background:"#f0fdf4",color:"#166534",border:"1px solid #86efac"}}>{w.status}</span>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {w.skills?.slice(0,4).map((s:string)=><span key={s} style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:"#fef9c3",color:C.textMid,border:"1px solid #fde068"}}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
