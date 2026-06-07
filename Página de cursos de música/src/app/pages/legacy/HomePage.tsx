import { useState, useEffect } from "react";
import { TRACKS, ALBUMS, COURSES, Appear } from "../../data/music-data";
import { AlbumCard, CourseCard } from "../../components/music/Cards";

export function HomePage({ setPage, setSelectedAlbum, onPlay, onPlayAlbum, currentTrack, playing }) {
  const [scrollY, setScrollY] = useState(0);
  const [filter, setFilter] = useState("Todos");
  const FILTERS = ["Todos","Electronic","Jazz","Ambient","Synthwave","Techno","Orquesta"];
  useEffect(() => { const h=()=>setScrollY(window.scrollY); window.addEventListener("scroll",h,{passive:true}); return ()=>window.removeEventListener("scroll",h); }, []);
  const heroOpacity = Math.max(0, 1 - scrollY/600);
  const filtered = filter==="Todos" ? ALBUMS : ALBUMS.filter(a=>a.genre===filter);
  const featuredCourses = COURSES.filter(c=>c.featured);

  return (
    <div style={{ paddingBottom:90 }}>
      {/* HERO */}
      <section style={{ position:"relative", height:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, transform:`translateY(${scrollY*.35}px)` }}>
          <img src="https://images.unsplash.com/photo-1639682687092-0264e96cbb71?w=1800&q=85" alt="" style={{ width:"100%", height:"115%", objectFit:"cover", objectPosition:"center 30%" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(8,8,8,.4) 0%, rgba(8,8,8,.2) 40%, #080808 100%)" }} />
        </div>
        <div style={{ position:"relative", maxWidth:1400, margin:"0 auto", padding:"0 40px", width:"100%", opacity: heroOpacity }}>
          <div className="ani" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", background:"rgba(200,240,106,.1)", border:"1px solid rgba(200,240,106,.25)", borderRadius:24, marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#c8f06a", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:11, color:"#c8f06a", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>Nuevo Lanzamiento · 2026</span>
          </div>
          <h1 className="ani" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(56px,10vw,114px)", fontWeight:400, lineHeight:.9, letterSpacing:"-3px", marginBottom:24, animationDelay:".1s" }}>
            Nocturnal<br /><em style={{ color:"rgba(255,255,255,.32)", fontStyle:"italic" }}>Sessions</em>
          </h1>
          <p className="ani" style={{ fontSize:18, color:"rgba(255,255,255,.52)", maxWidth:440, lineHeight:1.7, marginBottom:32, animationDelay:".2s" }}>
            Una exploración sonora que trasciende los límites de la música electrónica contemporánea
          </p>
          <div className="ani" style={{ display:"flex", gap:12, animationDelay:".3s" }}>
            <button className="btn-p" onClick={()=>onPlay(TRACKS[5])}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:2}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Reproducir
            </button>
            <button className="btn-g" onClick={()=>{ setSelectedAlbum(ALBUMS[2]); setPage("album"); }}>Ver álbum</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"60px 40px" }}>
        <Appear>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, padding:"44px 48px", background:"rgba(255,255,255,.015)", border:"1px solid rgba(255,255,255,.05)", borderRadius:20 }}>
            {[["2M+","Oyentes mensuales"],["50K","Canciones"],["180","Artistas exclusivos"],["98%","Satisfacción"]].map(([v,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:44, fontWeight:700, color:"#c8f06a", lineHeight:1 }}>{v}</div>
                <div style={{ color:"#555", fontSize:12, marginTop:8, letterSpacing:".5px" }}>{l}</div>
              </div>
            ))}
          </div>
        </Appear>
      </div>

      {/* FEATURED */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 40px 80px" }}>
        <Appear>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <div style={{ aspectRatio:"1", borderRadius:24, overflow:"hidden", boxShadow:"0 40px 80px rgba(0,0,0,.8)" }}>
                <img src={ALBUMS[0].image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .8s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
              </div>
              <div style={{ position:"absolute", bottom:-14, right:-14, background:"#c8f06a", color:"#080808", padding:"11px 18px", borderRadius:12, fontSize:13, fontWeight:700, boxShadow:"0 8px 24px rgba(200,240,106,.3)" }}>★ 4.9 · 2.8k reseñas</div>
            </div>
            <div>
              <span style={{ color:"#c8f06a", fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>Destacado del mes</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(36px,5vw,56px)", fontWeight:400, marginTop:12, marginBottom:18, letterSpacing:"-1px", lineHeight:1.1 }}>Midnight Dreams</h2>
              <p style={{ color:"rgba(255,255,255,.45)", fontSize:15, lineHeight:1.8, marginBottom:28 }}>{ALBUMS[0].description}</p>
              <div style={{ display:"flex", gap:28, marginBottom:32 }}>
                {[["12","Pistas"],["48:24","Duración"],["2026","Año"]].map(([v,l])=>(
                  <div key={l}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:26 }}>{v}</div><div style={{ color:"#444", fontSize:12, marginTop:3 }}>{l}</div></div>
                ))}
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button className="btn-p" onClick={()=>onPlay(TRACKS[0])}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:2}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Escuchar ahora
                </button>
                <button className="btn-g" onClick={()=>{ setSelectedAlbum(ALBUMS[0]); setPage("album"); }}>Ver tracklist</button>
              </div>
            </div>
          </div>
        </Appear>
      </div>

      {/* CATALOG */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 40px 80px" }}>
        <Appear>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
            <div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:400, letterSpacing:"-1px", marginBottom:4 }}>Catálogo</h2>
              <p style={{ color:"#555", fontSize:14 }}>Música curada para cada estado de ánimo</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
            {FILTERS.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:"6px 16px", borderRadius:24, border:"1px solid", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s", background: filter===f?"#c8f06a":"transparent", borderColor: filter===f?"#c8f06a":"rgba(255,255,255,.1)", color: filter===f?"#080808":"#666" }}>{f}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {filtered.map((album,i)=>(
              <Appear key={album.id} delay={i*50}>
                <AlbumCard album={album} onOpen={()=>{ setSelectedAlbum(album); setPage("album"); }} onPlay={()=>onPlayAlbum(album)} activeAlbum={currentTrack?.album} playing={playing} />
              </Appear>
            ))}
          </div>
        </Appear>
      </div>

      {/* QUOTE */}
      <div style={{ padding:"80px 40px", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,240,106,.04) 0%, transparent 70%)" }} />
        <Appear>
          <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:80, color:"rgba(200,240,106,.15)", lineHeight:1, marginBottom:-16 }}>"</div>
            <blockquote style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"clamp(22px,3vw,34px)", fontWeight:400, lineHeight:1.5, color:"rgba(255,255,255,.75)", marginBottom:20 }}>
              La música es el lenguaje que trasciende todas las barreras — la única forma de arte que habita simultáneamente el espacio interior y exterior.
            </blockquote>
            <p style={{ color:"#444", fontSize:13, letterSpacing:"1px" }}>— Carlos Méndez, Director Musical · Resonance</p>
          </div>
        </Appear>
      </div>

      {/* COURSES */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 40px 80px" }}>
        <Appear>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36 }}>
            <div>
              <span style={{ color:"#c8f06a", fontSize:11, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>Aprende con los mejores</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:400, letterSpacing:"-1px", marginTop:8 }}>Cursos destacados</h2>
            </div>
            <button className="btn-g" onClick={()=>setPage("courses")}>
              Ver todos
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {featuredCourses.map((c,i)=><Appear key={c.id} delay={i*70}><CourseCard course={c} /></Appear>)}
          </div>
        </Appear>
      </div>

      {/* CTA */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 40px 60px" }}>
        <Appear>
          <div style={{ position:"relative", borderRadius:28, overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, #0d1a0a 0%, #0a1520 50%, #100a18 100%)" }} />
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%, rgba(200,240,106,.12) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(106,180,240,.08) 0%, transparent 40%)" }} />
            <div style={{ position:"absolute", top:-40, right:80, width:200, height:200, borderRadius:"50%", border:"1px solid rgba(200,240,106,.1)" }} />
            <div style={{ position:"absolute", bottom:-60, right:160, width:300, height:300, borderRadius:"50%", border:"1px solid rgba(200,240,106,.05)" }} />
            <div style={{ position:"relative", padding:"72px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:40, flexWrap:"wrap" }}>
              <div style={{ maxWidth:520 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 12px", background:"rgba(200,240,106,.1)", border:"1px solid rgba(200,240,106,.2)", borderRadius:20, marginBottom:18 }}>
                  <span style={{ fontSize:11, color:"#c8f06a", fontWeight:700, letterSpacing:"1px" }}>★ PRUEBA GRATIS · 3 MESES</span>
                </div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(30px,4vw,46px)", fontWeight:400, letterSpacing:"-1px", marginBottom:14, lineHeight:1.1 }}>Tu música,<br /><em style={{ color:"#c8f06a" }}>sin límites</em></h2>
                <p style={{ color:"rgba(255,255,255,.45)", fontSize:15, lineHeight:1.7, marginBottom:28 }}>Acceso ilimitado a más de 50 millones de canciones en calidad lossless. Sin anuncios, sin interrupciones.</p>
                <div style={{ display:"flex", gap:12 }}>
                  <button className="btn-p" style={{ fontSize:15, padding:"13px 30px" }}>Comenzar gratis</button>
                  <button className="btn-g">Ver planes</button>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[["50M+","canciones en catálogo"],["Lossless","calidad de audio"],["Offline","escucha sin conexión"],["Exclusivos","contenido original"]].map(([v,l])=>(
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"#c8f06a", flexShrink:0 }} />
                    <span style={{ color:"#c8f06a", fontWeight:700, fontSize:14 }}>{v}</span>
                    <span style={{ color:"#555", fontSize:14 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Appear>
      </div>
    </div>
  );
}