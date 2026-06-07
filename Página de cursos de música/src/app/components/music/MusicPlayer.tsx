import { useState, useRef, useEffect } from "react";
import { VinylDisc, Wave } from "./AudioComponents";

export function MusicPlayer({ track, playlist, playing, onToggle, onSkip, onSelect }) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showList, setShowList] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState({});
  const [duration, setDuration] = useState(0);
  const barRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync audio src when track changes
  useEffect(() => {
    setProgress(0);
    if (audioRef.current && track.audioUrl) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      if (playing) audioRef.current.play().catch(() => {});
    }
  }, [track.id, track.audioUrl]);

  // Play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Track progress from real audio
  const handleTimeUpdate = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      onSkip(1);
    }
  };

  const fmt = (secs: number) => `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
  const currentTime = duration ? (progress / 100) * duration : 0;

  const IC = ({ d, size=16, fill="none", stroke="currentColor", sw=2 }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw}><path d={d}/></svg>
  );

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {showList && (
        <div style={{ position:"fixed", bottom:72, right:0, width:340, maxHeight:"55vh", overflowY:"auto", background:"rgba(10,10,10,.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,.06)", borderLeft:"1px solid rgba(255,255,255,.06)", zIndex:99, animation:"fadeUp .2s ease" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Cola de reproducción</span>
            <span style={{ fontSize:11, color:"#555" }}>{playlist.length} canciones</span>
          </div>
          {playlist.map(t => (
            <div key={t.id} onClick={() => onSelect(t)} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 18px", cursor:"pointer", background: t.id===track.id ? "rgba(37,99,235,.06)" : "transparent", borderLeft: t.id===track.id ? "2px solid #2563eb" : "2px solid transparent", transition:"background .15s" }}
              onMouseEnter={e=>{ if(t.id!==track.id) e.currentTarget.style.background="rgba(255,255,255,.03)"; }}
              onMouseLeave={e=>{ if(t.id!==track.id) e.currentTarget.style.background="transparent"; }}>
              <div style={{ width:36, height:36, borderRadius:6, overflow:"hidden", flexShrink:0, position:"relative" }}>
                <img src={t.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                {t.id===track.id && playing && <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center" }}><Wave playing bars={8} height={16} /></div>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color: t.id===track.id ? "#2563eb" : "#fff", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</div>
                <div style={{ fontSize:11, color:"#555", marginTop:2 }}>{t.artist}</div>
              </div>
              <span style={{ fontSize:11, color:"#444" }}>{t.duration}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, background:"rgba(8,8,8,.93)", backdropFilter:"blur(32px)" }}>
        {/* Progress bar — clickable */}
        <div ref={barRef} onClick={e=>{ if (barRef.current && audioRef.current && audioRef.current.duration) { const r=(barRef.current as HTMLElement).getBoundingClientRect(); const pct=((e.clientX-r.left)/r.width); audioRef.current.currentTime = pct * audioRef.current.duration; setProgress(pct*100); } }} style={{ height:3, background:"rgba(255,255,255,.06)", cursor:"pointer", position:"relative" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"#2563eb", transition:"width .15s linear", position:"relative" }}>
            <div style={{ position:"absolute", right:-5, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:"#2563eb", boxShadow:"0 0 8px rgba(37,99,235,.6)" }} />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr 280px", alignItems:"center", padding:"0 24px", height:70, gap:16 }}>
          {/* Track info */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <VinylDisc image={track.image} playing={playing} size={46} />
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{track.title}</div>
              <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{track.artist}</div>
            </div>
            <button onClick={() => setLiked(l=>({...l,[track.id]:!l[track.id]}))} style={{ background:"none", border:"none", cursor:"pointer", color: liked[track.id] ? "#f06a6a" : "#444", marginLeft:6, padding:4, transition:"color .2s, transform .2s" }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.8)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked[track.id]?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
          {/* Controls */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <button onClick={()=>setShuffle(!shuffle)} style={{ background:"none", border:"none", cursor:"pointer", color: shuffle?"#2563eb":"#444", padding:6, transition:"color .2s" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              </button>
              <button onClick={()=>onSkip(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", padding:6 }} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#aaa"}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
              <button onClick={onToggle} style={{ width:44, height:44, borderRadius:"50%", background:"#2563eb", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .2s, box-shadow .3s", boxShadow: playing ? "0 0 24px rgba(37,99,235,.5)" : "none", color:"#fff" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                {playing
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:2}}><polygon points="5 3 19 12 5 21 5 3"/></svg>}
              </button>
              <button onClick={()=>onSkip(1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", padding:6 }} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="#aaa"}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
              <button onClick={()=>setRepeat(!repeat)} style={{ background:"none", border:"none", cursor:"pointer", color: repeat?"#2563eb":"#444", padding:6, transition:"color .2s" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </button>
            </div>
            <div style={{ display:"flex", gap:8, fontSize:11, color:"#444" }}>
              <span>{fmt(currentTime)}</span><span>/</span><span>{duration ? fmt(duration) : track.duration}</span>
            </div>
          </div>
          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:16, justifyContent:"flex-end" }}>
            <div style={{ width:60 }}><Wave playing={playing} bars={16} /></div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <div onClick={e=>{ const r=e.currentTarget.getBoundingClientRect(); setVolume(Math.round(((e.clientX-r.left)/r.width)*100)); }} style={{ width:70, height:3, background:"rgba(255,255,255,.1)", borderRadius:2, cursor:"pointer" }}>
                <div style={{ height:"100%", width:`${volume}%`, background:"rgba(255,255,255,.5)", borderRadius:2 }} />
              </div>
            </div>
            <button onClick={()=>setShowList(!showList)} style={{ background: showList?"rgba(37,99,235,.1)":"none", border: showList?"1px solid rgba(37,99,235,.3)":"1px solid transparent", cursor:"pointer", color: showList?"#2563eb":"#444", padding:"7px 9px", borderRadius:8, transition:"all .2s", display:"flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}