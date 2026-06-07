import { useState } from "react";
import { ALBUMS, COURSES } from "../../data/music-data";
import { CourseCard } from "../../components/music/Cards";

export function AlbumPage({ album, setPage, onPlay, currentTrack, playing }) {
  const [hovT, setHovT] = useState(null);
  const ac = album.color || "#c8f06a";
  return (
    <div style={{ paddingBottom:100 }}>
      {/* Hero */}
      <div style={{ position:"relative", height:"68vh", display:"flex", alignItems:"flex-end", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0 }}>
          <img src={album.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"blur(55px) saturate(140%)", transform:"scale(1.2)", opacity:.45 }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(8,8,8,.35) 0%, #080808 82%)" }} />
        </div>
        <div style={{ position:"relative", maxWidth:1400, margin:"0 auto", padding:"0 40px 56px", width:"100%", display:"flex", gap:48, alignItems:"flex-end" }}>
          <div style={{ width:250, height:250, flexShrink:0, borderRadius:20, overflow:"hidden", boxShadow:"0 32px 64px rgba(0,0,0,.8)", animation:"fadeUp .6s ease both" }}>
            <img src={album.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ animation:"fadeUp .6s ease .1s both" }}>
            <div style={{ color:ac, fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>Álbum · {album.year}</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(38px,7vw,68px)", fontWeight:400, letterSpacing:"-2px", marginBottom:8, lineHeight:1 }}>{album.title}</h1>
            <div style={{ color:"#777", fontSize:16, marginBottom:14 }}>{album.artist}</div>
            <p style={{ color:"#555", fontSize:14, lineHeight:1.7, maxWidth:460, marginBottom:18 }}>{album.description}</p>
            <div style={{ display:"flex", gap:18, marginBottom:24 }}>
              {[[album.tracks,"pistas"],[album.duration,"duración"],[album.genre,"género"]].map(([v,l])=>(
                <div key={l}><span style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{v}</span><span style={{ color:"#555", fontSize:13 }}> {l}</span></div>
              ))}
            </div>
            <div style={{ display:"flex", gap:12 }}>
              <button className="btn-p" style={{ background:ac }} onClick={()=>onPlay({ id:album.id*100, title:album.tracklist[0].title, artist:album.artist, album:album.title, image:album.image, duration:album.tracklist[0].duration })}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:2}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Reproducir todo
              </button>
              <button className="btn-g" onClick={()=>setPage("home")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tracklist */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"36px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:40 }}>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0 16px 10px", borderBottom:"1px solid rgba(255,255,255,.05)", marginBottom:4 }}>
              {["#","TÍTULO","DURACIÓN"].map(h=><span key={h} style={{ fontSize:11, color:"#333", fontWeight:700, letterSpacing:"1px", flex: h==="TÍTULO"?1:undefined, marginLeft: h==="TÍTULO"?"16px":undefined }}>{h}</span>)}
            </div>
            {album.tracklist.map((t,i)=>{
              const isAct = currentTrack?.title===t.title && currentTrack?.album===album.title;
              return (
                <div key={t.n} onMouseEnter={()=>setHovT(t.n)} onMouseLeave={()=>setHovT(null)} onClick={()=>onPlay({ id:t.n, title:t.title, artist:album.artist, album:album.title, image:album.image, duration:t.duration })}
                  style={{ display:"flex", alignItems:"center", gap:16, padding:"11px 16px", borderRadius:10, cursor:"pointer", background: isAct?`${ac}0e`: hovT===t.n?"rgba(255,255,255,.03)":"transparent", borderLeft: isAct?`2px solid ${ac}`:"2px solid transparent", transition:"all .15s", animation:`fadeUp .4s ease ${i*35}ms both` }}>
                  <div style={{ width:24, textAlign:"center", flexShrink:0 }}>
                    {isAct&&playing ? <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:16, justifyContent:"center" }}>{[1,2,3].map(b=><div key={b} style={{ width:3, background:ac, borderRadius:1, animation:`waveBar ${.4+b*.2}s ease infinite alternate`, animationDelay:`${b*.1}s`, height:`${30+b*20}%` }}/>)}</div>
                      : hovT===t.n ? <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" style={{marginLeft:2}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      : <span style={{ fontSize:13, color: isAct?ac:"#444" }}>{t.n}</span>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, color: isAct?ac:"#fff", fontWeight: isAct?600:400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</div>
                    <div style={{ fontSize:12, color:"#444", marginTop:2 }}>{album.artist}</div>
                  </div>
                  <span style={{ fontSize:13, color:"#444" }}>{t.duration}</span>
                </div>
              );
            })}
          </div>
          {/* Sidebar */}
          <div>
            <h3 style={{ fontSize:12, fontWeight:700, color:"#444", letterSpacing:"1px", textTransform:"uppercase", marginBottom:18 }}>Más álbumes</h3>
            {ALBUMS.filter(a=>a.id!==album.id).slice(0,5).map(a=>(
              <div key={a.id} style={{ display:"flex", gap:12, alignItems:"center", cursor:"pointer", padding:"8px", borderRadius:10, transition:"background .15s", marginBottom:4 }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                onClick={()=>{}}>
                <div style={{ width:46, height:46, borderRadius:8, overflow:"hidden", flexShrink:0 }}><img src={a.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{a.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoursesPage({ setPage, onCourseClick }) {
  const [filter, setFilter] = useState("Todos");
  const [sort, setSort] = useState("rating");
  const LEVELS = ["Todos","Básico","Intermedio","Avanzado"];

  const filtered = COURSES.filter(c=>filter==="Todos"||c.level===filter).sort((a,b)=>sort==="rating"?b.rating-a.rating:b.students-a.students);
  
  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"120px 40px 48px" }}>
        {/* Botón Volver */}
        <button 
          onClick={() => setPage("home")} 
          style={{ 
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </button>
        
        <div style={{ maxWidth:580, animation:"fadeUp .6s ease both" }}>
          <span style={{ color:"#c8f06a", fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>Aprende con los mejores</span>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(38px,6vw,62px)", fontWeight:400, letterSpacing:"-2px", marginTop:10, marginBottom:14, lineHeight:1.1 }}>Cursos de Música</h1>
          <p style={{ color:"rgba(255,255,255,.42)", fontSize:17, lineHeight:1.7 }}>Aprende de músicos y productores de clase mundial.</p>
        </div>
        <div style={{ display:"flex", gap:36, marginTop:36, paddingTop:28, borderTop:"1px solid rgba(255,255,255,.05)" }}>
          {[[`${COURSES.length} cursos`,"disponibles"],["15,000+","estudiantes activos"],["4.8 ★","calificación"],["Certificado","al completar"]].map(([v,l])=>(
            <div key={l}><div style={{ fontSize:15, fontWeight:600 }}>{v}</div><div style={{ fontSize:12, color:"#555", marginTop:2 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", gap:8 }}>
            {LEVELS.map(l=><button key={l} onClick={()=>setFilter(l)} style={{ padding:"7px 18px", borderRadius:24, border:"1px solid", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s", background: filter===l?"#c8f06a":"transparent", borderColor: filter===l?"#c8f06a":"rgba(255,255,255,.1)", color: filter===l?"#080808":"#666" }}>{l}</button>)}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:12, color:"#555" }}>Ordenar:</span>
            {[["rating","Mejor valorados"],["students","Más populares"]].map(([v,l])=>(
              <button key={v} onClick={()=>setSort(v)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .2s", background: sort===v?"rgba(255,255,255,.06)":"transparent", borderColor: sort===v?"rgba(255,255,255,.15)":"rgba(255,255,255,.07)", color: sort===v?"#fff":"#555" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {filtered.map((c,i)=><div key={c.id} style={{ animation:`fadeUp .5s ease ${i*55}ms both` }}><CourseCard course={c} onClick={() => onCourseClick?.(c)} /></div>)}
        </div>
        <div style={{ marginTop:56, padding:"44px 48px", background:"linear-gradient(135deg,rgba(200,240,106,.05) 0%,rgba(106,180,240,.05) 100%)", border:"1px solid rgba(200,240,106,.1)", borderRadius:24, display:"flex", justifyContent:"space-between", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:400, marginBottom:8 }}>¿Eres instructor?</h3>
            <p style={{ color:"#555", fontSize:14, lineHeight:1.6 }}>Comparte tu conocimiento con miles de estudiantes. Crea y monetiza tus cursos.</p>
          </div>
          <button className="btn-p" style={{ flexShrink:0 }}>
            Enseña en Resonance
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}