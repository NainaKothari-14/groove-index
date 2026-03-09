import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* ════════════════════════════════════════════
   FIXED PALETTE  — never changes
════════════════════════════════════════════ */
const GOLD   = "#c9a84c";
const GOLD2  = "#e8c97a";
const CRIMSON = "#8b1a1a";
const DIM    = "rgba(255,255,255,0.08)";
const PANEL  = "rgba(12,10,8,0.82)";

/* ════════════════════════════════════════════
   ARTIST DATA
════════════════════════════════════════════ */
const artists = [
  {
    id: 1,
    name: "NOVA ECLIPSE",
    genre: "Dark Synth",
    tags: ["Electronic","Cinematic","Ambient"],
    album: "Midnight Circuitry",
    year: 2024, tracks: 11, listeners: "2.4M",
    vinylInner: "#1a0a05", vinylGroove: "#2e1408",
    bio: "Crafting sonic landscapes where industrial noise meets spectral beauty.",
    bars: [40,70,55,90,45,80,60,75,50,85,65,70],
    melody: [0,3,7,10,14,10,7,3],
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    bgImg: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1400&q=80",
    tracklist: ["Neon Requiem","Circuit Silence","Dead Stars","Phantom Signal","Infrared","Obsidian Drift","Glass Pulse","Static Hymn","Zero Hour","Collapse","The Void Between"],
    duration: ["3:42","4:11","5:02","3:28","4:55","3:17","4:38","5:21","3:09","4:44","6:03"],
  },
  {
    id: 2,
    name: "VELVET STATIC",
    genre: "Neo Soul",
    tags: ["Soul","Jazz Fusion","R&B"],
    album: "Ghost Notes",
    year: 2024, tracks: 9, listeners: "1.8M",
    vinylInner: "#0d0012", vinylGroove: "#1e0028",
    bio: "Where the vintage warmth of soul meets the cold edge of modernity.",
    bars: [60,85,50,75,90,40,70,55,80,65,45,78],
    melody: [0,4,7,11,9,7,4,2],
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80",
    bgImg: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1400&q=80",
    tracklist: ["Lavender Smoke","Old Gold","Tender Machine","Breathe Slow","Drift","Silk & Static","Midnight Gospel","Unravel","Ghost Notes"],
    duration: ["3:55","4:22","5:10","3:41","4:07","3:58","5:33","4:16","6:14"],
  },
  {
    id: 3,
    name: "IRON TIDE",
    genre: "Post-Metal",
    tags: ["Metal","Drone","Experimental"],
    album: "Tectonic Hymns",
    year: 2023, tracks: 7, listeners: "3.1M",
    vinylInner: "#0f0800", vinylGroove: "#201200",
    bio: "Slow-burning catharsis forged from distortion and patience.",
    bars: [80,45,95,60,70,85,50,90,40,75,88,55],
    melody: [0,2,5,7,5,3,0,-2],
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    bgImg: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1400&q=80",
    tracklist: ["Fault Line","Pyroclast","Weight of Stone","Tremor Suite","Iron Hymn","Subduction","The Long Burn"],
    duration: ["6:18","7:44","5:55","8:02","6:30","9:11","12:04"],
  },
  {
    id: 4,
    name: "SABLE COAST",
    genre: "Shoegaze",
    tags: ["Dream Pop","Indie","Ethereal"],
    album: "Fog Index",
    year: 2024, tracks: 10, listeners: "900K",
    vinylInner: "#001510", vinylGroove: "#002e1c",
    bio: "Submerged in reverb. Lost in the beautiful wreckage of sound.",
    bars: [55,75,65,80,45,70,85,50,90,60,75,40],
    melody: [0,5,9,12,9,7,5,2],
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
    bgImg: "https://images.unsplash.com/photo-1421217336522-861978e26756?w=1400&q=80",
    tracklist: ["Fog Index","Pale Harbour","Underwater Radio","Dissolve","Silverine","The Quiet Break","Current","Salt Memory","Tide Hymn","Shore"],
    duration: ["4:02","3:49","5:17","4:33","3:58","6:01","4:14","3:37","5:28","4:55"],
  },
  {
    id: 5,
    name: "CRUEL GEOMETRY",
    genre: "Industrial",
    tags: ["Noise","EBM","Dark Techno"],
    album: "Hard Architecture",
    year: 2023, tracks: 13, listeners: "1.2M",
    vinylInner: "#050508", vinylGroove: "#0d0d16",
    bio: "Music as machine. Rhythm as weapon. Silence as threat.",
    bars: [90,55,80,40,95,65,75,50,85,70,45,88],
    melody: [0,1,5,8,6,4,1,-1],
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    bgImg: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1400&q=80",
    tracklist: ["Concrete Pulse","Steel Corridor","Hammer Sequence","Grid Collapse","Null Zone","Binary Riot","Dead Channel","Mechanism","Override","Threshold","Pressure","Fracture","Hard Architecture"],
    duration: ["4:22","3:58","5:11","4:44","3:33","6:02","4:17","5:38","3:49","4:55","5:22","4:08","7:14"],
  },
];

const NOTE_SYMBOLS = ["♩","♪","♫","♬","𝄞","♭","♯","𝄢"];

/* ════════════════════════════════════════════
   WEB AUDIO
════════════════════════════════════════════ */
function useAudio() {
  const ctxRef  = useRef(null);
  const gainRef = useRef(null);
  const loopRef = useRef(null);
  const stepRef = useRef(0);
  const pool    = useRef([]);

  const init = useCallback(() => {
    if (ctxRef.current) return;
    const ctx    = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.15, ctx.currentTime);
    const conv = ctx.createConvolver();
    const len  = ctx.sampleRate * 2;
    const buf  = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < len; i++) ch[i] = (Math.random()*2-1)*Math.pow(1-i/len,2.8);
    }
    conv.buffer = buf;
    const rvb = ctx.createGain();
    rvb.gain.setValueAtTime(0.28, ctx.currentTime);
    master.connect(ctx.destination);
    master.connect(conv); conv.connect(rvb); rvb.connect(ctx.destination);
    ctxRef.current = ctx; gainRef.current = master;
  }, []);

  const playNote = useCallback((freq, when, dur = 0.9) => {
    const ctx = ctxRef.current; if (!ctx) return;
    const osc = ctx.createOscillator(), env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, when);
    env.gain.setValueAtTime(0, when);
    env.gain.linearRampToValueAtTime(0.6, when + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, when + dur);
    osc.connect(env); env.connect(gainRef.current);
    osc.start(when); osc.stop(when + dur + 0.05);
    pool.current.push(osc);
  }, []);

  const startLoop = useCallback((melody) => {
    const ctx = ctxRef.current; if (!ctx) return;
    const base = 220, tempo = 0.52;
    stepRef.current = 0;
    const tick = () => {
      const now  = ctx.currentTime;
      const freq = base * Math.pow(2, melody[stepRef.current % melody.length] / 12);
      playNote(freq, now, tempo * 1.05);
      if (stepRef.current % 3 === 0) playNote(freq * 1.498, now + 0.03, tempo * 0.55);
      stepRef.current++;
      loopRef.current = setTimeout(tick, tempo * 1000);
    };
    tick();
  }, [playNote]);

  const stopLoop = useCallback(() => {
    clearTimeout(loopRef.current);
    pool.current.forEach(o => { try { o.stop(); } catch(_){} });
    pool.current = [];
  }, []);

  const setVol = useCallback((v) => {
    if (gainRef.current && ctxRef.current)
      gainRef.current.gain.setValueAtTime(v, ctxRef.current.currentTime);
  }, []);

  return { init, startLoop, stopLoop, setVol };
}

/* ════════════════════════════════════════════
   FLOATING NOTES
════════════════════════════════════════════ */
function FloatingNotes({ isPlaying }) {
  const [notes, setNotes] = useState([]);
  const ctr = useRef(0);
  useEffect(() => {
    if (!isPlaying) { setNotes([]); return; }
    const iv = setInterval(() => {
      const nid  = ctr.current++;
      const sym  = NOTE_SYMBOLS[Math.floor(Math.random()*NOTE_SYMBOLS.length)];
      const x    = (Math.random()-0.5)*230;
      const dur  = 2000 + Math.random()*1600;
      const size = 14 + Math.random()*22;
      const rot  = (Math.random()-0.5)*55;
      const dx   = (Math.random()-0.5)*90;
      setNotes(p => [...p.slice(-22), { nid,sym,x,dur,size,rot,dx }]);
      setTimeout(() => setNotes(p => p.filter(n => n.nid !== nid)), dur+300);
    }, 240);
    return () => clearInterval(iv);
  }, [isPlaying]);

  return (
    <div style={{ position:"absolute",inset:0,overflow:"visible",pointerEvents:"none",zIndex:20 }}>
      {notes.map(n => (
        <div key={n.nid} style={{
          position:"absolute", bottom:"50%", left:`calc(50% + ${n.x}px)`,
          fontSize:`${n.size}px`, color:GOLD,
          textShadow:`0 0 10px ${GOLD}bb, 0 0 24px ${GOLD}44`,
          animation:`noteFloat ${n.dur}ms ease-out forwards`,
          "--rot":`${n.rot}deg`, "--dx":`${n.dx}px`,
          userSelect:"none", willChange:"transform,opacity",
        }}>{n.sym}</div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   SIDE VINYL + TONEARM
════════════════════════════════════════════ */
function SideVinyl({ artist, isPlaying }) {
  return (
    <div style={{ position:"relative", width:"300px", height:"300px", flexShrink:0 }}>
      <FloatingNotes isPlaying={isPlaying} />

      {/* Outer gold halo */}
      <div style={{
        position:"absolute", inset:"-36px", borderRadius:"50%",
        background:`radial-gradient(circle, ${CRIMSON}28 0%, transparent 68%)`,
        animation: isPlaying ? "halo 2.8s ease-in-out infinite" : "none",
      }}/>

      {/* Disc */}
      <div style={{
        width:"100%", height:"100%", borderRadius:"50%",
        background:`radial-gradient(circle at 50% 50%,
          ${artist.vinylInner} 0%,
          ${artist.vinylGroove} 13%, ${artist.vinylInner} 15%,
          ${artist.vinylGroove} 26%, ${artist.vinylInner} 28%,
          ${artist.vinylGroove} 40%, ${artist.vinylInner} 42%,
          ${artist.vinylGroove} 54%, ${artist.vinylInner} 56%,
          ${artist.vinylGroove} 68%, ${artist.vinylInner} 70%,
          ${artist.vinylGroove} 81%, #0a0a0a 83%, #060606 100%
        )`,
        boxShadow: isPlaying
          ? `0 0 80px ${CRIMSON}44, 0 0 160px ${CRIMSON}18, 0 28px 80px rgba(0,0,0,0.9)`
          : `0 0 30px ${CRIMSON}18, 0 18px 56px rgba(0,0,0,0.7)`,
        animation: isPlaying ? "spin 3s linear infinite" : "none",
        transition:"box-shadow 0.9s ease",
        position:"relative",
      }}>
        {/* Center label — artist photo */}
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          width:"33%", height:"33%", borderRadius:"50%",
          overflow:"hidden",
          boxShadow:`0 0 28px ${GOLD}66, inset 0 0 16px rgba(0,0,0,0.5)`,
          border:`2px solid ${GOLD}66`,
        }}>
          <img src={artist.img} alt={artist.name}
            style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.82 }}
          />
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%",
            background:`radial-gradient(circle at center, transparent 22%, ${CRIMSON}55 100%)`,
          }}/>
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:"14%", height:"14%", borderRadius:"50%",
            background:"#000", zIndex:2,
          }}/>
        </div>
        {/* Sheen */}
        <div style={{
          position:"absolute", inset:0, borderRadius:"50%",
          background:"linear-gradient(120deg,rgba(255,255,255,0.07) 0%,transparent 48%,rgba(255,255,255,0.02) 100%)",
          pointerEvents:"none",
        }}/>
      </div>

      {/* Tonearm */}
      <div style={{
        position:"absolute", top:"-14px", right:"-22px",
        transformOrigin:"92px 16px",
        transform: isPlaying ? "rotate(-20deg)" : "rotate(-42deg)",
        transition:"transform 1.5s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex:30,
      }}>
        <svg width="115" height="175" viewBox="0 0 115 175" fill="none">
          <line x1="92" y1="16" x2="28" y2="160" stroke={`${GOLD}88`} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="28" y1="160" x2="15" y2="174" stroke={`${GOLD}aa`} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="92" cy="16" r="9" fill="#181410" stroke={`${GOLD}44`} strokeWidth="1.5"/>
          <circle cx="92" cy="16" r="4" fill={`${GOLD}99`}/>
          <circle cx="13" cy="174" r="4" fill={isPlaying?GOLD:`${GOLD}44`}
            style={{ filter: isPlaying?`drop-shadow(0 0 5px ${GOLD})`:"none" }}/>
        </svg>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   WAVEFORM
════════════════════════════════════════════ */
function Waveform({ bars, isPlaying, small }) {
  const h = small ? "24px" : "34px";
  return (
    <div style={{ display:"flex", alignItems:"center", gap: small?"2px":"3px", height:h }}>
      {bars.map((v, i) => (
        <div key={i} style={{
          width: small?"2px":"3px", height:`${v}%`,
          background:`linear-gradient(to top,${GOLD},${GOLD}44)`,
          borderRadius:"2px",
          animation: isPlaying ? `wb .75s ease-in-out ${i*.055}s infinite alternate` : "none",
          transformOrigin:"center",
        }}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   TRACKLIST PANEL
════════════════════════════════════════════ */
function Tracklist({ artist, activeTrack, onTrack }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
      {artist.tracklist.map((title, i) => {
        const isActive = i === activeTrack;
        return (
          <div key={i}
            onClick={() => onTrack(i)}
            style={{
              display:"flex", alignItems:"center", gap:"14px",
              padding:"9px 14px", borderRadius:"8px", cursor:"pointer",
              background: isActive ? `${GOLD}10` : "transparent",
              border: isActive ? `1px solid ${GOLD}25` : "1px solid transparent",
              transition:"all .2s",
            }}
            onMouseEnter={e => { if(!isActive) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
            onMouseLeave={e => { if(!isActive) e.currentTarget.style.background="transparent"; }}
          >
            {/* Index / play icon */}
            <div style={{
              width:"20px", textAlign:"right", flexShrink:0,
              fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
              color: isActive ? GOLD : "rgba(255,255,255,0.22)",
            }}>
              {isActive ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD}><polygon points="5,3 19,12 5,21"/></svg>
              ) : (
                String(i+1).padStart(2,"0")
              )}
            </div>

            {/* Title */}
            <span style={{
              flex:1, fontSize:"13px", fontFamily:"'Cormorant Garamond',serif",
              fontWeight: isActive ? "600" : "400",
              color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
              transition:"color .2s",
            }}>{title}</span>

            {/* Mini bars if active */}
            {isActive && (
              <div style={{ display:"flex", alignItems:"center", gap:"2px", height:"16px" }}>
                {[60,90,50,80,70].map((v,j) => (
                  <div key={j} style={{
                    width:"2px", height:`${v}%`,
                    background:GOLD, borderRadius:"1px",
                    animation:`wb .6s ease-in-out ${j*.07}s infinite alternate`,
                  }}/>
                ))}
              </div>
            )}

            {/* Duration */}
            <span style={{
              fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
              color:"rgba(255,255,255,0.25)", flexShrink:0,
            }}>{artist.duration[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN
════════════════════════════════════════════ */
export default function MusicShowcase() {
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [volume,       setVolume]       = useState(0.15);
  const [activeTrack,  setActiveTrack]  = useState(0);
  const [bgLoaded,     setBgLoaded]     = useState(false);
  const { init, startLoop, stopLoop, setVol } = useAudio();

  const active = artists[activeIndex];

  useEffect(() => {
    setBgLoaded(false);
    const t = setTimeout(() => setBgLoaded(true), 60);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const handlePlay = () => {
    init();
    if (!isPlaying) { startLoop(active.melody); setIsPlaying(true); }
    else            { stopLoop();               setIsPlaying(false); }
  };
  const handleVol  = (v) => { setVolume(v); setVol(v); };
  const handleSlide = (s) => { stopLoop(); setIsPlaying(false); setActiveIndex(s.realIndex); setActiveTrack(0); };
  const handleTrack = (i) => { setActiveTrack(i); if(!isPlaying){ init(); startLoop(active.melody); setIsPlaying(true); } };
  useEffect(() => () => stopLoop(), []);

  return (
    <div style={{ minHeight:"100vh", background:"#080604", color:"#fff", overflow:"hidden", position:"relative" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080604; }

        .swiper            { padding:28px 0 56px !important; }
        .swiper-slide      { width:262px !important; transition:opacity .4s; }
        .swiper-pagination-bullet { background:rgba(255,255,255,0.16)!important; width:5px!important; height:5px!important; transition:all .3s!important; }
        .swiper-pagination-bullet-active { background:${GOLD}!important; width:20px!important; border-radius:3px!important; }
        .swiper-button-next,.swiper-button-prev { color:rgba(255,255,255,0.2)!important; transition:color .2s!important; }
        .swiper-button-next:hover,.swiper-button-prev:hover { color:${GOLD}!important; }
        .swiper-button-next::after,.swiper-button-prev::after { font-size:14px!important; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes halo     { 0%,100%{transform:scale(1);opacity:.55} 50%{transform:scale(1.09);opacity:1} }
        @keyframes wb       { from{transform:scaleY(.2);opacity:.4} to{transform:scaleY(1);opacity:1} }
        @keyframes noteFloat {
          0%  {opacity:0;transform:translate(0,0) rotate(0deg) scale(.5);}
          12% {opacity:.9;}
          100%{opacity:0;transform:translate(var(--dx,20px),-200px) rotate(var(--rot,25deg)) scale(.28);}
        }
        @keyframes bgFade   { from{opacity:0} to{opacity:1} }
        @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 ${GOLD}40} 50%{box-shadow:0 0 0 10px transparent} }
        @keyframes shimmer  { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }

        .swiper-slide-active .card-inner { transform:translateY(-8px) scale(1.02); }
        .card-inner { transition:transform .45s cubic-bezier(.34,1.3,.64,1), box-shadow .4s, border-color .4s; cursor:pointer; }
        .card-inner:hover { filter:brightness(1.04); }

        .tag { padding:3px 10px; border-radius:20px; font-size:9px; letter-spacing:1.2px;
          text-transform:uppercase; border:1px solid rgba(255,255,255,0.09); color:rgba(255,255,255,0.38);
          background:rgba(255,255,255,0.03); font-family:'JetBrains Mono',monospace; transition:all .2s; cursor:default; }
        .tag:hover { color:${GOLD}; border-color:${GOLD}55; }

        .stat-card { text-align:center; padding:12px 18px; border:1px solid rgba(255,255,255,0.07);
          border-radius:10px; background:rgba(255,255,255,0.02); transition:all .25s; }
        .stat-card:hover { border-color:${GOLD}44; background:rgba(201,168,76,0.04); transform:translateY(-2px); }

        .nav-lnk { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2.5px;
          text-transform:uppercase; color:rgba(255,255,255,0.22); cursor:pointer; transition:color .2s; }
        .nav-lnk:hover { color:${GOLD}; }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none; width:12px; height:12px; border-radius:50%;
          background:${GOLD}; cursor:pointer; box-shadow:0 0 5px ${GOLD}66;
        }
        .play-pulse { animation: pulse 2s ease infinite; }

        /* scrollbar for tracklist */
        .tracklist-scroll { scrollbar-width:thin; scrollbar-color:${GOLD}33 transparent; }
        .tracklist-scroll::-webkit-scrollbar { width:3px; }
        .tracklist-scroll::-webkit-scrollbar-thumb { background:${GOLD}44; border-radius:2px; }
      `}</style>

      {/* ── FIXED DARK CINEMATIC BG ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0 }}>
        <div key={`bg-${activeIndex}`} style={{
          position:"absolute", inset:0,
          backgroundImage:`url(${active.bgImg})`,
          backgroundSize:"cover", backgroundPosition:"center 30%",
          opacity: bgLoaded ? 0.1 : 0,
          transition:"opacity 1.4s ease",
          filter:"blur(3px) saturate(0.4) brightness(0.5)",
        }}/>
        {/* Hard dark overlay — keeps colour locked */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(8,6,4,0.72) 0%,rgba(8,6,4,0.82) 50%,rgba(8,6,4,0.96) 100%)" }}/>
        {/* Subtle fixed warm glow top */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 65% 45% at 50% -5%, ${CRIMSON}18 0%, transparent 55%)` }}/>
        {/* Grain */}
        <div style={{
          position:"absolute", inset:0, opacity:.028,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:"180px",
        }}/>
      </div>

      {/* ── PAGE ── */}
      <div style={{ position:"relative", zIndex:1, maxWidth:"1320px", margin:"0 auto", padding:"0 36px" }}>

        {/* HEADER */}
        <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"26px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {/* Vinyl logo */}
            <div style={{
              width:"28px", height:"28px", borderRadius:"50%",
              background:`conic-gradient(from 0deg,${CRIMSON},#1a1008 42%,${CRIMSON})`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#080604" }}/>
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:`${GOLD}88` }}>GROOVE INDEX</span>
          </div>

          <nav style={{ display:"flex", gap:"28px" }}>
            {["Artists","Albums","Charts","Radio"].map(l => <span key={l} className="nav-lnk">{l}</span>)}
          </nav>

          {/* Live pill */}
          <div style={{
            display:"flex", alignItems:"center", gap:"7px",
            padding:"6px 14px", borderRadius:"20px",
            background:"rgba(255,255,255,0.03)", border:`1px solid ${DIM}`,
          }}>
            <div style={{
              width:"6px", height:"6px", borderRadius:"50%",
              background: isPlaying ? GOLD : "rgba(255,255,255,0.18)",
              boxShadow: isPlaying ? `0 0 8px ${GOLD}` : "none",
              transition:"all .3s", animation: isPlaying ? "shimmer 1.5s ease infinite" : "none",
            }}/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color: isPlaying ? GOLD : "rgba(255,255,255,0.28)", transition:"color .3s" }}>
              {isPlaying ? "Live" : "Idle"}
            </span>
          </div>
        </header>

        {/* HERO */}
        <div style={{ textAlign:"center", paddingTop:"42px", paddingBottom:"4px", animation:"fadeUp .9s ease both" }}>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", letterSpacing:"5px", textTransform:"uppercase", color:`${GOLD}bb`, marginBottom:"12px" }}>
            ◆ Featured Artists 2024 ◆
          </p>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(44px,7.5vw,96px)", fontWeight:"700",
            letterSpacing:"-1.5px", lineHeight:.92,
            background:`linear-gradient(135deg, #fff 30%, ${GOLD2} 60%, ${GOLD} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>Sound Architecture</h1>
          <p style={{
            fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
            color:"rgba(255,255,255,0.22)", fontSize:"17px", marginTop:"10px",
            animation:"fadeUp .9s ease .15s both",
          }}>Where music becomes monument</p>
        </div>

        {/* ── SWIPER ── */}
        <div style={{ animation:"fadeIn 1s ease .4s both" }}>
          <Swiper
            effect="coverflow" grabCursor centeredSlides slidesPerView="auto"
            coverflowEffect={{ rotate:24, stretch:0, depth:200, modifier:1.2, slideShadows:true }}
            pagination={{ clickable:true }} navigation
            modules={[EffectCoverflow, Pagination, Navigation]}
            onSlideChange={handleSlide}
          >
            {artists.map((art, idx) => {
              const isAct = idx === activeIndex;
              return (
                <SwiperSlide key={art.id}>
                  <div
                    className="card-inner"
                    onClick={() => isAct && handlePlay()}
                    style={{
                      borderRadius:"20px", overflow:"hidden",
                      border:`1px solid ${isAct ? GOLD+"44" : "rgba(255,255,255,0.06)"}`,
                      boxShadow: isAct
                        ? `0 24px 64px ${CRIMSON}28, 0 0 0 1px ${GOLD}18, inset 0 1px 0 rgba(255,255,255,0.07)`
                        : "0 10px 28px rgba(0,0,0,0.55)",
                      background:PANEL, backdropFilter:"blur(20px)",
                    }}
                  >
                    {/* Photo banner */}
                    <div style={{ position:"relative", height:"155px", overflow:"hidden" }}>
                      <img src={art.img} alt={art.name}
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
                          filter:"saturate(0.65) brightness(0.65)", transition:"transform .6s ease" }}
                        onMouseEnter={e => e.target.style.transform="scale(1.07)"}
                        onMouseLeave={e => e.target.style.transform="scale(1)"}
                      />
                      <div style={{
                        position:"absolute", inset:0,
                        background:`linear-gradient(to bottom, rgba(8,6,4,0.15) 0%, transparent 40%, rgba(12,10,8,0.9) 100%)`,
                      }}/>
                      {/* Genre badge */}
                      <div style={{
                        position:"absolute", top:"11px", left:"11px",
                        display:"flex", alignItems:"center", gap:"5px",
                        padding:"3px 10px", borderRadius:"20px",
                        background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)",
                        border:`1px solid ${GOLD}44`,
                      }}>
                        <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:GOLD, boxShadow:`0 0 5px ${GOLD}` }}/>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase", color:GOLD }}>{art.genre}</span>
                      </div>
                      {/* Play state top-right */}
                      {isAct && (
                        <div style={{
                          position:"absolute", top:"11px", right:"11px",
                          width:"26px", height:"26px", borderRadius:"50%",
                          background: isPlaying ? CRIMSON : "rgba(255,255,255,0.08)",
                          border:`1px solid ${isPlaying ? GOLD+"66" : "rgba(255,255,255,0.18)"}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          backdropFilter:"blur(8px)", transition:"all .3s",
                        }}>
                          {isPlaying
                            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                            : <svg width="9" height="9" viewBox="0 0 24 24" fill="white" style={{marginLeft:"1px"}}><polygon points="5,3 19,12 5,21"/></svg>
                          }
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div style={{ padding:"16px 18px 18px" }}>
                      <div style={{ position:"relative", marginBottom:"12px" }}>
                        {/* Float mini-vinyl right */}
                        <div style={{
                          float:"right", width:"58px", height:"58px", borderRadius:"50%",
                          background:`radial-gradient(circle,${art.vinylInner} 0%,${art.vinylGroove} 16%,${art.vinylInner} 18%,${art.vinylGroove} 35%,${art.vinylInner} 37%,${art.vinylGroove} 54%,${art.vinylInner} 56%,${art.vinylGroove} 72%,#0a0a0a 74%)`,
                          boxShadow: isAct ? `0 0 18px ${CRIMSON}44` : "none",
                          animation: isAct && isPlaying ? "spin 3s linear infinite" : "none",
                          position:"relative",
                        }}>
                          <div style={{
                            position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                            width:"27%", height:"27%", borderRadius:"50%",
                            background:`radial-gradient(circle,${GOLD2}cc,${GOLD})`,
                            boxShadow:`0 0 8px ${GOLD}66`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            <div style={{ width:"22%", height:"22%", borderRadius:"50%", background:"#000" }}/>
                          </div>
                          <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 55%)" }}/>
                        </div>
                        <h2 style={{ fontSize:"17px", fontWeight:"700", lineHeight:1.1, marginBottom:"3px", paddingRight:"68px", fontFamily:"'Cormorant Garamond',serif" }}>{art.name}</h2>
                        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(255,255,255,0.26)", paddingRight:"68px" }}>{art.album} · {art.year}</p>
                      </div>
                      <div style={{ clear:"both" }}/>
                      <div style={{ marginBottom:"13px" }}>
                        <Waveform bars={art.bars} isPlaying={isAct && isPlaying} small/>
                      </div>
                      <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                        {art.tags.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ══ BOTTOM SECTION — 3-column ══ */}
        <div
          key={active.id}
          style={{
            display:"grid", gridTemplateColumns:"1fr 1fr 300px",
            gap:"20px", alignItems:"start",
            paddingBottom:"70px",
            animation:"fadeUp .55s ease both",
          }}
        >

          {/* COL 1 — Artist info */}
          <div style={{
            padding:"36px 38px",
            background:PANEL, backdropFilter:"blur(24px)",
            border:`1px solid ${GOLD}1a`,
            borderRadius:"20px",
            boxShadow:`0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            {/* Artist header */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", marginBottom:"22px" }}>
              <div style={{
                width:"66px", height:"66px", borderRadius:"50%", overflow:"hidden", flexShrink:0,
                border:`2px solid ${GOLD}55`, boxShadow:`0 0 20px ${GOLD}30`,
              }}>
                <img src={active.img} alt={active.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", filter:"saturate(0.75)" }}
                />
              </div>
              <div style={{ flex:1 }}>
                <h3 style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"clamp(22px,3vw,40px)", fontWeight:"700",
                  letterSpacing:"-.5px", lineHeight:.95, marginBottom:"6px",
                  background:`linear-gradient(135deg,#fff 45%,${GOLD}99)`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                }}>{active.name}</h3>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", letterSpacing:"3px", color:GOLD, textTransform:"uppercase" }}>{active.genre}</span>
                  <span style={{ color:"rgba(255,255,255,0.2)" }}>·</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(255,255,255,0.28)", textTransform:"uppercase" }}>{active.listeners} listeners</span>
                </div>
              </div>
            </div>

            {/* Gold divider */}
            <div style={{ height:"1px", background:`linear-gradient(to right,${GOLD}44,transparent)`, marginBottom:"20px" }}/>

            {/* Bio */}
            <p style={{
              fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
              color:"rgba(255,255,255,0.4)", fontSize:"15px", lineHeight:"1.8", marginBottom:"24px",
            }}>"{active.bio}"</p>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"26px" }}>
              {[
                { label:"Album",     value:active.album },
                { label:"Year",      value:active.year },
                { label:"Tracks",    value:active.tracks },
                { label:"Listeners", value:active.listeners },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"7px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", marginBottom:"5px" }}>{s.label}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", fontWeight:"600" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
              <button
                onClick={handlePlay}
                className={isPlaying ? "play-pulse" : ""}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                style={{
                  width:"50px", height:"50px", borderRadius:"50%", border:"none",
                  background:`linear-gradient(135deg,${CRIMSON},${CRIMSON}aa)`,
                  boxShadow:`0 6px 24px ${CRIMSON}55`,
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0, transition:"transform .3s",
                }}
              >
                {isPlaying
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="white" style={{marginLeft:"2px"}}><polygon points="5,3 19,12 5,21"/></svg>
                }
              </button>

              <div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.26)", marginBottom:"7px" }}>
                  {isPlaying ? "▶ NOW PLAYING" : "PREVIEW"}
                </div>
                {/* Volume */}
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD} opacity=".5">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                  <input type="range" min="0" max="1" step=".01" value={volume}
                    onChange={e => handleVol(parseFloat(e.target.value))}
                    style={{
                      WebkitAppearance:"none", width:"80px", height:"3px", borderRadius:"2px",
                      outline:"none", cursor:"pointer",
                      background:`linear-gradient(to right,${GOLD} ${volume*100}%,rgba(255,255,255,0.12) ${volume*100}%)`,
                    }}
                  />
                </div>
              </div>

              <div style={{ opacity:isPlaying?1:.18, transition:"opacity .5s" }}>
                <Waveform bars={active.bars} isPlaying={isPlaying}/>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop:"22px" }}>
              <div style={{ height:"2px", borderRadius:"2px", background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:"2px",
                  background:`linear-gradient(to right,${CRIMSON},${GOLD})`,
                  width: isPlaying ? "44%" : "0%",
                  transition: isPlaying ? "width 28s linear" : "width .4s",
                }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", color:"rgba(255,255,255,0.18)" }}>1:24</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", color:"rgba(255,255,255,0.18)" }}>{active.duration[activeTrack]}</span>
              </div>
            </div>
          </div>

          {/* COL 2 — Tracklist */}
          <div style={{
            padding:"32px 28px",
            background:PANEL, backdropFilter:"blur(24px)",
            border:`1px solid ${GOLD}1a`,
            borderRadius:"20px",
            boxShadow:`0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
              <div>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", letterSpacing:"3px", textTransform:"uppercase", color:`${GOLD}88`, marginBottom:"4px" }}>Full Tracklist</p>
                <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:"600", color:"#fff" }}>{active.album}</h4>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", color:"rgba(255,255,255,0.22)", letterSpacing:"1px" }}>{active.tracks} tracks</p>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", color:"rgba(255,255,255,0.22)", letterSpacing:"1px" }}>{active.year}</p>
              </div>
            </div>

            {/* Gold line */}
            <div style={{ height:"1px", background:`linear-gradient(to right,${GOLD}44,transparent)`, marginBottom:"16px" }}/>

            {/* Tracks */}
            <div className="tracklist-scroll" style={{ maxHeight:"340px", overflowY:"auto", paddingRight:"4px" }}>
              <Tracklist artist={active} activeTrack={activeTrack} onTrack={handleTrack}/>
            </div>
          </div>

          {/* COL 3 — Side Vinyl */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"24px", paddingTop:"16px" }}>
            <SideVinyl artist={active} isPlaying={isPlaying}/>

            {/* Artist nav dots */}
            <div style={{ display:"flex", gap:"8px" }}>
              {artists.map((art, i) => (
                <div key={art.id} style={{
                  width: i===activeIndex ? "22px" : "6px",
                  height:"6px", borderRadius:"3px",
                  background: i===activeIndex ? GOLD : "rgba(255,255,255,0.15)",
                  transition:"all .3s", cursor:"pointer",
                  boxShadow: i===activeIndex ? `0 0 8px ${GOLD}88` : "none",
                }}/>
              ))}
            </div>

            {/* Now-playing label */}
            {isPlaying && (
              <div style={{
                padding:"8px 16px", borderRadius:"20px",
                background:`rgba(201,168,76,0.08)`, border:`1px solid ${GOLD}33`,
                textAlign:"center",
              }}>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:GOLD, marginBottom:"2px" }}>Now Playing</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", color:"rgba(255,255,255,0.7)" }}>{active.tracklist[activeTrack]}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}