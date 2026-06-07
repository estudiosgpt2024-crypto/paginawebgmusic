import { useState, useRef, useEffect } from "react";
import { OptimizedImage, getOptimizedImageUrl } from "../ui/OptimizedImage";

export function VinylDisc({ image, playing, size = 48 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0, position:"relative", animation: playing ? "spin 4s linear infinite" : "none", boxShadow: playing ? "0 0 16px rgba(37,99,235,.4)" : "none", transition:"box-shadow .5s" }}>
      <OptimizedImage
        src={getOptimizedImageUrl(image, 200)}
        alt="Album cover"
        aspectRatio="1"
        objectFit="cover"
        style={{ opacity: .7 }}
        priority={true}
      />
      <div style={{ position:"absolute", inset:0, background:"repeating-radial-gradient(circle at center,transparent 0,transparent 3px,rgba(0,0,0,.15) 3px,rgba(0,0,0,.15) 4px)" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:size*.2, height:size*.2, borderRadius:"50%", background:"#2563eb" }} />
    </div>
  );
}

export function Wave({ playing, color="#2563eb", bars=20, height=24 }) {
  const hs = useRef(Array.from({length:bars},()=>Math.random()*60+20));
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2, height }}>
      {hs.current.map((h,i)=>(
        <div key={i} style={{ width:3, height:`${h}%`, background:color, borderRadius:2, opacity: playing ? .8 : .2, transformOrigin:"bottom", animation: playing ? `waveBar ${.5+Math.random()*.7}s ease-in-out infinite alternate` : "none", animationDelay:`${i*.05}s`, transition:"opacity .3s" }} />
      ))}
    </div>
  );
}