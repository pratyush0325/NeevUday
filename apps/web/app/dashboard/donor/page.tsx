"use client";
import { useState, useEffect } from "react";
import { useMyDonations, useDonorStats, useCreateDonation } from "@/hooks/useApi";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { DonationCategory } from "@setu/shared";
import "../../donor-animations.css";

const C = {
  pageBg:          "#ffffff",
  sidebarBg:       "#fafafa",
  sidebarBorder:   "rgba(0,0,0,0.07)",
  cardBg:          "#ffffff",
  cardBorder:      "rgba(0,0,0,0.08)",
  rowBg:           "#fafafa",
  rowBorder:       "rgba(0,0,0,0.06)",
  // yellow accents
  yellow:          "#facc15",
  yellowDark:      "#eab308",
  yellowLight:     "#fef9c3",
  yellowBorder:    "rgba(234,179,8,0.3)",
  btnBg:           "linear-gradient(135deg,#facc15,#eab308)",
  btnShadow:       "0 4px 14px rgba(234,179,8,0.35)",
  // black touches
  black:           "#111111",
  blackSoft:       "#1a1a1a",
  navActive:       "#111111",
  // text
  textDark:        "#111111",
  textMid:         "#333333",
  textSoft:        "#555555",
  textMuted:       "#888888",
  // avatar
  avatarBg:        "#111111",
  // sidebar user badge
  userBadgeBg:     "#f4f4f4",
  userBadgeBorder: "rgba(0,0,0,0.08)",
  impactBg:        "#fefce8",
  impactBorder:    "rgba(234,179,8,0.25)",
};

const CATEGORIES: DonationCategory[] = ["food","clothing","medical","infrastructure","other"];
const UNITS = ["pieces","kg","boxes","litres","bags","sets"];
const STATUS_STYLES: Record<string,{bg:string;text:string;dot:string}> = {
  queued:     { bg:"#fefce8", text:"#713f12", dot:"#facc15" },
  matched:    { bg:"#fef9c3", text:"#713f12", dot:"#eab308" },
  in_transit: { bg:"#f0fdf4", text:"#166534", dot:"#22c55e" },
  delivered:  { bg:"#f0fdf4", text:"#166534", dot:"#16a34a" },
};
const CATEGORY_ICONS: Record<string,string> = { food:"🌾",clothing:"👕",medical:"💊",infrastructure:"🏗️",other:"📦" };
const inputStyle: React.CSSProperties = { background:"#fafafa",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:10,padding:"10px 14px",fontSize:14,color:C.textDark,outline:"none",width:"100%",transition:"border 0.15s" };

function AnimatedNumber({value}:{value:number}){
  const[d,setD]=useState(0);
  useEffect(()=>{if(!value)return;let s=0;const step=value/(700/16);const t=setInterval(()=>{s+=step;if(s>=value){setD(value);clearInterval(t);}else setD(Math.floor(s));},16);return()=>clearInterval(t);},[value]);
  return <>{d}</>;
}

export default function DonorDashboard(){
  const{data:stats}=useDonorStats();const{data:donations,isLoading}=useMyDonations();const createDonation=useCreateDonation();const{user,clearAuth}=useAuthStore();const router=useRouter();
  const[form,setForm]=useState({category:"food" as DonationCategory,itemName:"",quantity:"",unit:"pieces"});
  const[formSuccess,setFormSuccess]=useState(false);const[formError,setFormError]=useState("");
  const[activeTab,setActiveTab]=useState<"overview"|"donations"|"new">("overview");

  const submit=async(e:React.FormEvent)=>{e.preventDefault();setFormError("");if(!form.itemName||!form.quantity){setFormError("Please fill all fields.");return;}
    try{await createDonation.mutateAsync({...form,quantity:parseInt(form.quantity)});setFormSuccess(true);setForm({category:"food",itemName:"",quantity:"",unit:"pieces"});setTimeout(()=>setFormSuccess(false),3000);}catch{setFormError("Failed to submit.");}};

  const navItems = [
    {id:"overview",label:"Overview",icon:"◈"},
    {id:"donations",label:"My Donations",icon:"📦"},
    {id:"new",label:"New Donation",icon:"＋"},
  ] as const;

  return (
    <div style={{minHeight:"100vh",background:C.pageBg}}>

      {/* subtle yellow blobs — much lighter now */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div className="animate-float" style={{position:"absolute",top:-100,right:-100,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,#fde047,transparent 70%)",opacity:0.08}}/>
        <div className="animate-float" style={{position:"absolute",bottom:0,left:-80,width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,#facc15,transparent 70%)",opacity:0.06,animationDelay:"2s"}}/>
      </div>

      {/* ── SIDEBAR ── */}
      <aside style={{position:"fixed",left:0,top:0,height:"100%",width:236,zIndex:20,background:C.sidebarBg,borderRight:`1px solid ${C.sidebarBorder}`,display:"flex",flexDirection:"column"}}>

        {/* Logo */}
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.sidebarBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div className="animate-glow-pulse" style={{width:32,height:32,borderRadius:8,background:C.black,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:C.yellow,fontSize:13,fontWeight:800}}>N</span>
            </div>
            <span style={{fontFamily:"Georgia,serif",fontSize:19,color:C.textDark,fontWeight:500,letterSpacing:"-0.02em"}}>NeevUday</span>
          </div>
        </div>

        {/* User */}
        <div style={{padding:"12px 12px 0"}}>
          <div className="animate-slide-up" style={{padding:"10px 12px",borderRadius:10,background:C.userBadgeBg,border:`1px solid ${C.userBadgeBorder}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.yellow,flexShrink:0}}>
                {(user?.name?.[0]??"D").toUpperCase()}
              </div>
              <div style={{minWidth:0}}>
                <p style={{fontSize:13,fontWeight:600,color:C.textDark,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name??"Donor"}</p>
                <p style={{fontSize:11,color:C.textMuted,margin:0}}>Donor account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:3}}>
          {navItems.map((item,i)=>(
            <button key={item.id} onClick={()=>setActiveTab(item.id)} className={`animate-slide-up stagger-${i+2}`}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",transition:"all 0.18s",
                background: activeTab===item.id ? C.black : "transparent",
                color: activeTab===item.id ? "#ffffff" : C.textMid,
              }}>
              <span style={{fontSize:14,width:18,textAlign:"center",opacity: activeTab===item.id ? 1 : 0.7}}>{item.icon}</span>
              {item.label}
              {activeTab===item.id && <span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.yellow,flexShrink:0}}/>}
            </button>
          ))}
        </nav>

        {/* Impact */}
        <div style={{margin:"0 12px 12px",padding:"12px 14px",borderRadius:10,background:C.impactBg,border:`1px solid ${C.impactBorder}`}}>
          <p style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Your impact</p>
          <div style={{display:"flex",justifyContent:"space-between",textAlign:"center"}}>
            {[{val:stats?.total??0,label:"Donated"},{val:stats?.villagesReached??0,label:"Villages"},{val:stats?.delivered??0,label:"Delivered"}].map((s,i)=>(
              <div key={i}>
                <p style={{fontSize:18,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0}}>{s.val}</p>
                <p style={{fontSize:10,color:C.textMuted,margin:0}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={()=>{clearAuth();router.push("/auth/login");}}
          style={{margin:"0 12px 16px",padding:"7px 12px",borderRadius:8,background:"transparent",border:"none",cursor:"pointer",fontSize:12,color:C.textMuted,display:"flex",alignItems:"center",gap:6,transition:"color 0.15s"}}>
          ↩ Log out
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main style={{marginLeft:236,minHeight:"100vh",padding:"40px 36px",position:"relative",zIndex:10}}>

        {/* ── OVERVIEW ── */}
        {activeTab==="overview"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:32}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textMuted,marginBottom:6}}>Donor Dashboard</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:38,fontWeight:500,color:C.textDark,lineHeight:1.15,margin:0}}>
                Good to see you,{" "}<span className="shimmer-text">{user?.name?.split(" ")[0]??"friend"}.</span>
              </h1>
              <p style={{color:C.textSoft,marginTop:8,fontSize:13}}>Here's how your generosity is moving the world.</p>
            </div>

            {/* Metric cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
              {[
                {label:"Total donations",   value:stats?.total??0,          icon:"📦"},
                {label:"Active / in transit",value:stats?.active??0,         icon:"🚚"},
                {label:"Delivered",          value:stats?.delivered??0,      icon:"✅"},
                {label:"Villages reached",   value:stats?.villagesReached??0,icon:"🏘️"},
              ].map((m,idx)=>(
                <div key={m.label} className={`animate-slide-up stagger-${idx+1} donor-card-hover`}
                  style={{borderRadius:14,padding:"20px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,position:"relative",overflow:"hidden"}}>
                  {/* yellow top accent bar */}
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:C.yellow,borderRadius:"14px 14px 0 0"}}/>
                  <div style={{fontSize:22,marginBottom:10}}>{m.icon}</div>
                  <p style={{fontSize:32,fontFamily:"Georgia,serif",fontWeight:500,color:C.textDark,margin:0,lineHeight:1}}><AnimatedNumber value={m.value}/></p>
                  <p style={{fontSize:11,color:C.textMuted,marginTop:6}}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Recent + CTA */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              {/* Recent */}
              <div className="animate-slide-up stagger-3" style={{gridColumn:"1/3",borderRadius:14,padding:"22px",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:500,color:C.textDark,margin:0}}>Recent donations</h2>
                  <button onClick={()=>setActiveTab("donations")} style={{fontSize:12,color:C.textMuted,background:"none",border:"none",cursor:"pointer",fontWeight:500,transition:"color 0.15s"}}>View all →</button>
                </div>
                {isLoading?(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>{[1,2,3].map(i=><div key={i} style={{height:46,borderRadius:8,background:"#f4f4f4",animation:"pulse 1.5s ease infinite"}}/>)}</div>
                ):!donations?.length?(
                  <div style={{textAlign:"center",padding:"28px 0"}}>
                    <div style={{fontSize:36,marginBottom:8}}>📭</div>
                    <p style={{color:C.textMuted,fontSize:13}}>No donations yet.</p>
                    <button onClick={()=>setActiveTab("new")} style={{marginTop:8,fontSize:12,color:C.yellowDark,background:"none",border:"none",cursor:"pointer",fontWeight:500}}>Make your first →</button>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {donations.slice(0,5).map((d:any,i:number)=>{
                      const s=STATUS_STYLES[d.status]??STATUS_STYLES.queued;
                      return(
                        <div key={d.id} className="animate-fade-in donor-card-hover"
                          style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:9,background:C.rowBg,border:`1px solid ${C.rowBorder}`,animationDelay:`${i*0.06}s`}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:32,height:32,borderRadius:8,background:C.yellowLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                              {CATEGORY_ICONS[d.category]??"📦"}
                            </div>
                            <div>
                              <p style={{fontSize:13,fontWeight:500,color:C.textDark,margin:0}}>{d.itemName}</p>
                              <p style={{fontSize:11,color:C.textMuted,margin:0}}>{d.quantity} {d.unit} · {d.category}</p>
                            </div>
                          </div>
                          <span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:500,padding:"3px 10px",borderRadius:99,background:s.bg,color:s.text}}>
                            <span style={{width:5,height:5,borderRadius:"50%",background:s.dot,flexShrink:0}}/>
                            {d.status.replace("_"," ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CTA card */}
              <div className="animate-slide-up stagger-4"
                style={{borderRadius:14,padding:"22px",background:"#fffbeb",border:`1px solid rgba(234,179,8,0.25)`,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
                {/* floating sparkles */}
                {[{s:7,t:"12%",l:"78%",d:"0s"},{s:5,t:"28%",l:"88%",d:"0.6s"},{s:8,t:"60%",l:"83%",d:"1.1s"},{s:4,t:"75%",l:"91%",d:"0.4s"}].map((dot,i)=>(
                  <div key={i} className="animate-float" style={{position:"absolute",top:dot.t,left:dot.l,width:dot.s,height:dot.s,borderRadius:"50%",background:C.yellow,opacity:0.4,animationDelay:dot.d,pointerEvents:"none"}}/>
                ))}
                <div style={{width:40,height:40,borderRadius:10,background:C.yellowLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:12}}>🤲</div>
                <h3 style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:500,color:C.textDark,margin:"0 0 6px"}}>Ready to give?</h3>
                <p style={{fontSize:12,color:C.textSoft,lineHeight:1.6,marginBottom:14}}>Your goods reach verified NGOs and villages — matched automatically.</p>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                  {[{icon:"📦",step:"You donate goods"},{icon:"🔗",step:"We match to a need"},{icon:"🚚",step:"Worker delivers it"},{icon:"🏘️",step:"Village receives aid"}].map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:24,height:24,borderRadius:6,background:"rgba(250,204,21,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{s.icon}</div>
                      <span style={{fontSize:11,color:C.textMid}}>{s.step}</span>
                    </div>
                  ))}
                </div>
                <div style={{padding:"9px 12px",borderRadius:9,background:"rgba(255,255,255,0.7)",border:`1px solid ${C.yellowBorder}`,display:"flex",justifyContent:"space-between",marginBottom:14}}>
                  <div><p style={{fontSize:10,color:C.textMuted,margin:0,textTransform:"uppercase",letterSpacing:"0.06em"}}>Avg. delivery</p><p style={{fontSize:14,fontWeight:500,color:C.textDark,fontFamily:"Georgia,serif",margin:0}}>3–5 days</p></div>
                  <div style={{textAlign:"right"}}><p style={{fontSize:10,color:C.textMuted,margin:0,textTransform:"uppercase",letterSpacing:"0.06em"}}>Match rate</p><p style={{fontSize:14,fontWeight:500,color:C.textDark,fontFamily:"Georgia,serif",margin:0}}>94%</p></div>
                </div>
                <button onClick={()=>setActiveTab("new")} style={{width:"100%",padding:"10px",borderRadius:9,border:"none",background:C.black,cursor:"pointer",fontSize:13,fontWeight:600,color:"#ffffff",transition:"opacity 0.15s"}}>
                  New donation →
                </button>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="animate-slide-up stagger-4" style={{marginTop:16,borderRadius:14,padding:"18px 28px",background:C.black,display:"flex",alignItems:"center",justifyContent:"space-around",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent 0%,rgba(250,204,21,0.08) 50%,transparent 100%)",backgroundSize:"200% 100%",animation:"shimmer 3s linear infinite",pointerEvents:"none"}}/>
              {[{val:"1,240+",label:"Donations on NeevUday",icon:"📦"},{val:"87",label:"Villages across India",icon:"🏘️"},{val:"94%",label:"Successful match rate",icon:"🔗"},{val:"3 days",label:"Average delivery",icon:"🚚"},{val:"320+",label:"Families helped",icon:"❤️"}].map((s,i)=>(
                <div key={i} className="animate-fade-in" style={{textAlign:"center",animationDelay:`${i*0.08}s`,zIndex:1}}>
                  <div style={{fontSize:16,marginBottom:3}}>{s.icon}</div>
                  <p style={{fontSize:20,fontFamily:"Georgia,serif",fontWeight:500,color:"#ffffff",margin:0}}>{s.val}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:3}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DONATIONS LIST ── */}
        {activeTab==="donations"&&(
          <div>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>History</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:500,color:C.textDark,margin:0}}>All donations</h1>
            </div>
            <div className="animate-slide-up stagger-1" style={{borderRadius:14,overflow:"hidden",background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"10px 18px",background:C.black,fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.1em"}}>
                <div>Item</div><div>Category</div><div>Quantity</div><div>Matched to</div><div>Status</div>
              </div>
              {isLoading?(
                <div style={{padding:18,display:"flex",flexDirection:"column",gap:8}}>{[1,2,3,4].map(i=><div key={i} style={{height:44,borderRadius:8,background:"#f4f4f4"}}/>)}</div>
              ):!donations?.length?(
                <div style={{textAlign:"center",padding:"56px 0"}}><div style={{fontSize:40,marginBottom:10}}>📭</div><p style={{color:C.textMuted}}>No donations yet.</p></div>
              ):donations.map((d:any,i:number)=>{
                const s=STATUS_STYLES[d.status]??STATUS_STYLES.queued;
                return(
                  <div key={d.id} className="donor-card-hover animate-fade-in"
                    style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 18px",alignItems:"center",animationDelay:`${i*0.04}s`,borderBottom:i<donations.length-1?`1px solid ${C.rowBorder}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:30,height:30,borderRadius:7,background:C.yellowLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{CATEGORY_ICONS[d.category]??"📦"}</div>
                      <span style={{fontSize:13,fontWeight:500,color:C.textDark}}>{d.itemName}</span>
                    </div>
                    <span style={{fontSize:12,color:C.textMuted,textTransform:"capitalize"}}>{d.category}</span>
                    <span style={{fontSize:13,color:C.textMid}}>{d.quantity} <span style={{fontSize:11,color:C.textMuted}}>{d.unit}</span></span>
                    <span style={{fontSize:12,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>{d.matchedNgoName??d.matchedVillageName??"—"}</span>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:99,background:s.bg,color:s.text,width:"fit-content"}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:s.dot}}/>{d.status.replace("_"," ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NEW DONATION ── */}
        {activeTab==="new"&&(
          <div style={{maxWidth:580}}>
            <div className="animate-slide-up" style={{marginBottom:24}}>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.textMuted,marginBottom:4}}>Donate</p>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:500,color:C.textDark,margin:0}}>Submit a donation</h1>
              <p style={{color:C.textMuted,fontSize:13,marginTop:6}}>Matched to verified NGOs and village requests automatically.</p>
            </div>

            {formSuccess&&(
              <div className="animate-slide-up" style={{marginBottom:16,padding:"14px 16px",borderRadius:10,background:"#f0fdf4",border:"1px solid #86efac",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:20}}>🎉</span>
                <p style={{fontSize:13,fontWeight:600,color:"#166534",margin:0}}>Donation submitted! We'll match it where it's needed most.</p>
              </div>
            )}

            <div className="animate-slide-up stagger-1" style={{borderRadius:14,padding:"28px",background:C.cardBg,border:`1px solid ${C.cardBorder}`,boxShadow:"0 2px 20px rgba(0,0,0,0.04)"}}>
              <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:20}}>

                {/* Category */}
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Category</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                    {CATEGORIES.map(c=>(
                      <button type="button" key={c} onClick={()=>setForm(f=>({...f,category:c}))}
                        style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"11px 4px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,transition:"all 0.18s",
                          background: form.category===c ? C.black : C.rowBg,
                          color: form.category===c ? "#ffffff" : C.textMid,
                          transform: form.category===c ? "scale(1.04)" : "scale(1)",
                          boxShadow: form.category===c ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                          outline: form.category!==c ? `1px solid ${C.cardBorder}` : "none",
                        }}>
                        <span style={{fontSize:20}}>{CATEGORY_ICONS[c]}</span>
                        <span style={{textTransform:"capitalize"}}>{c}</span>
                        {form.category===c&&<span style={{width:4,height:4,borderRadius:"50%",background:C.yellow}}/>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item */}
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Item description</label>
                  <input style={inputStyle} placeholder="e.g. Woollen blankets, Rice bags, First-aid kits"
                    value={form.itemName}
                    onFocus={e=>e.target.style.border="1.5px solid #111"}
                    onBlur={e=>e.target.style.border="1.5px solid rgba(0,0,0,0.1)"}
                    onChange={e=>setForm(f=>({...f,itemName:e.target.value}))} required/>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Quantity</label>
                    <input type="number" min="1" style={inputStyle} placeholder="500"
                      value={form.quantity}
                      onFocus={e=>e.target.style.border="1.5px solid #111"}
                      onBlur={e=>e.target.style.border="1.5px solid rgba(0,0,0,0.1)"}
                      onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} required/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Unit</label>
                    <select style={{...inputStyle,appearance:"none" as any}}
                      value={form.unit}
                      onFocus={e=>(e.target as any).style.border="1.5px solid #111"}
                      onBlur={e=>(e.target as any).style.border="1.5px solid rgba(0,0,0,0.1)"}
                      onChange={e=>setForm(f=>({...f,unit:e.target.value}))}>
                      {UNITS.map(u=><option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                {formError&&<p style={{fontSize:12,color:"#dc2626",background:"#fef2f2",padding:"10px 14px",borderRadius:8,margin:0}}>{formError}</p>}

                {form.itemName&&form.quantity&&(
                  <div className="animate-fade-in" style={{padding:"12px 14px",borderRadius:9,background:C.yellowLight,border:`1px solid ${C.yellowBorder}`}}>
                    <p style={{fontSize:10,color:C.textMuted,fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>Preview</p>
                    <p style={{fontSize:13,fontWeight:500,color:C.textDark,margin:0}}>{CATEGORY_ICONS[form.category]} {form.quantity} {form.unit} of {form.itemName}</p>
                  </div>
                )}

                <button type="submit" disabled={createDonation.isPending}
                  style={{padding:"13px",borderRadius:10,border:"none",background:C.black,fontSize:14,fontWeight:600,color:"#ffffff",cursor:"pointer",transition:"opacity 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {createDonation.isPending
                    ?<><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Submitting…</>
                    :<>Submit donation <span style={{color:C.yellow}}>→</span></>}
                </button>
              </form>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:12}}>
              {[{icon:"🔍",title:"Smart matching",desc:"Goods matched to the right village request automatically."},{icon:"✅",title:"Verified NGOs",desc:"All recipients vetted before receiving donations."},{icon:"📍",title:"Track delivery",desc:"Follow your donation from submission to delivery."}].map((c,i)=>(
                <div key={c.title} className={`animate-slide-up stagger-${i+2}`}
                  style={{padding:"14px",borderRadius:12,background:C.cardBg,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{fontSize:18,marginBottom:8}}>{c.icon}</div>
                  <p style={{fontSize:12,fontWeight:600,color:C.textDark,marginBottom:4}}>{c.title}</p>
                  <p style={{fontSize:11,color:C.textMuted,lineHeight:1.5,margin:0}}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
